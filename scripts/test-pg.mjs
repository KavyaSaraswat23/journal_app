import pg from 'pg'; 
const client = new pg.Client({ connectionString: process.env.DATABASE_URL }); 
try { 
    await client.connect(); const res = await client.query('SELECT 1 as ok'); 
    console.log('connected', res.rows); 
} catch (err) { console.error('connection error', err); 
        process.exit(1); 
} finally { 
    await client.end(); 

}