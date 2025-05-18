import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.repo || !data.reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Submit to Airtable
    const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
      },
      body: JSON.stringify({
        fields: {
          Name: data.name,
          Email: data.email,
          Repository: data.repo,
          Reason: data.reason,
          SubmissionDate: new Date().toISOString()
        }
      })
    });

    console.log('response', response)
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(errorData.error?.message || 'Error submitting to Airtable');
    }
    
    const result = await response.json();
    return NextResponse.json({ success: true, data: result });
    
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit entry: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const offset = searchParams.get('offset') || null;
    const countOnly = searchParams.get('countOnly') === 'true';
    const pageSize = 10;
    
    // If we only need the count, use a different approach
    if (countOnly) {
      // For Airtable, we need to fetch all records to get an accurate count
      // This is not ideal for large tables, but it's the most reliable method
      const countUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}?pageSize=100`;
      
      const countResponse = await fetch(countUrl, {
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
        }
      });
      
      if (!countResponse.ok) {
        throw new Error('Failed to fetch submission count');
      }
      
      const countData = await countResponse.json();
      
      // Get the count from the records array length
      const count = countData.records.length;
      
      // If there's an offset, we need to make additional requests to get the full count
      // This is a simplified approach and might not work for very large tables
      let totalCount = count;
      let currentOffset = countData.offset;
      
      // For simplicity, we'll limit to a reasonable number of requests
      const MAX_REQUESTS = 5;
      let requestCount = 0;
      
      while (currentOffset && requestCount < MAX_REQUESTS) {
        requestCount++;
        
        const nextPageUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}?pageSize=100&offset=${currentOffset}`;
        
        const nextPageResponse = await fetch(nextPageUrl, {
          headers: {
            'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
          }
        });
        
        if (!nextPageResponse.ok) {
          break;
        }
        
        const nextPageData = await nextPageResponse.json();
        totalCount += nextPageData.records.length;
        currentOffset = nextPageData.offset;
      }
      
      return NextResponse.json({ totalRecords: totalCount });
    }
    
    // Regular data fetching with sorting
    let url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}?pageSize=${pageSize}&sort[0][field]=SubmissionDate&sort[0][direction]=desc`;
    
    if (offset) {
      url += `&offset=${offset}`;
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch submissions from Airtable');
    }
    
    const data = await response.json();
    
    // Transform Airtable response to match expected format
    const transformedData = {
      list: data.records.map(record => ({
        id: record.id,
        ...record.fields
      })),
      pageInfo: {
        hasNextPage: !!data.offset,
        offset: data.offset || null
      }
    };
    
    return NextResponse.json(transformedData);
    
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}