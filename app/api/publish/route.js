import { pool } from '../../../utils/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { title, company, location_type, location, job_type, description, email } = await req.json();

        // If location is not needed (Remote or null location_type), we can set location to null
        const locationValue = location_type === 'Remote' || location_type === '' ? null : location;

        const client = await pool.connect();
        await client.query(
            `INSERT INTO jobs (title, company, location_type, location, job_type, description, user_email)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [title, company, location_type, locationValue, job_type, description, email]
        );
        client.release();
        
        return NextResponse.json({ message: 'Job published successfully' }, { status: 201 });
    } catch (err) {
        console.error('Error publishing job:', err);
        return NextResponse.json({ error: 'Failed to publish job' }, { status: 500 });
    }
}
