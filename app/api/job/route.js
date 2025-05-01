import { pool } from '../../../utils/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = req.nextUrl;
    const email = searchParams.get('email');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
        let result;

        if (email) {
            // Fetch jobs specific to the provided email
            result = await pool.query(
                'SELECT id, title, company, location_type, location, job_type, description FROM jobs WHERE user_email = $1',
                [email]
            );
        } else {
            // Fetch paginated jobs (default behavior)
            result = await pool.query(
                'SELECT id, title, company, location_type, location, job_type, description FROM jobs LIMIT $1 OFFSET $2',
                [limit, offset]
            );
        }

        return NextResponse.json({ jobs: result.rows });
    } catch (err) {
        console.error('Error fetching jobs:', err);
        return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
    }
}
