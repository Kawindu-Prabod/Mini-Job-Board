import { pool } from '../../../utils/db';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
    try {
        const { jobId } = await req.json();

        if (!jobId) {
            return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
        }

        const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING *', [jobId]);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Job deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting job:', error);
        return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
    }
}
