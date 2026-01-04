const { pool } = require('./utils/db');
const { verifyToken, extractToken } = require('./utils/jwt');

exports.handler = async (event) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Extract and verify token
        const token = extractToken(event.headers.authorization);
        if (!token) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Authorization token required' })
            };
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Invalid or expired token' })
            };
        }

        const { data } = JSON.parse(event.body);

        if (!data) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Data is required' })
            };
        }

        // Upsert user data (insert or update if exists)
        const result = await pool.query(
            `INSERT INTO user_data (user_id, data, updated_at)
             VALUES ($1, $2, CURRENT_TIMESTAMP)
             ON CONFLICT (user_id) 
             DO UPDATE SET data = $2, updated_at = CURRENT_TIMESTAMP
             RETURNING updated_at`,
            [decoded.userId, JSON.stringify(data)]
        );

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: 'Data synced successfully',
                updatedAt: result.rows[0].updated_at
            })
        };

    } catch (error) {
        console.error('Sync save error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
