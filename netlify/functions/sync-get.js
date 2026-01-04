const { pool } = require('./utils/db');
const { verifyToken, extractToken } = require('./utils/jwt');

exports.handler = async (event) => {
    // Only allow GET
    if (event.httpMethod !== 'GET') {
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

        // Fetch user data from database
        const result = await pool.query(
            'SELECT data, updated_at FROM user_data WHERE user_id = $1',
            [decoded.userId]
        );

        if (result.rows.length === 0) {
            // No data found - user hasn't synced yet
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    data: null,
                    updatedAt: null,
                    message: 'No data found for this user'
                })
            };
        }

        const userData = result.rows[0];

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                data: userData.data,
                updatedAt: userData.updated_at
            })
        };

    } catch (error) {
        console.error('Sync get error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
