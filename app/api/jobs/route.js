import { pool } from '../../../utils/db';
import { NextResponse } from 'next/server'; // Import NextResponse

// Handle GET requests to fetch jobs
export async function GET(req) {
    const { page = 1 } = req.nextUrl.searchParams; // Get page from query params
    const limit = 10; // Number of jobs per page
    const offset = (page - 1) * limit; // Calculate offset for pagination

    try {
        // Query the database to get jobs with pagination
        const result = await pool.query(
            'SELECT id, title, company, location_type, location, job_type, description FROM jobs LIMIT $1 OFFSET $2',
            [limit, offset]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ jobs: [] }); // Return an empty array if no jobs
        }

        // Respond with the jobs found
        return NextResponse.json({ jobs: result.rows });
    } catch (err) {
        console.error('Error fetching jobs:', err);
        // Use NextResponse with status code
        return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
    }
}
