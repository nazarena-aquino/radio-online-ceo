import pool from './pool';
import dotenv from 'dotenv';

dotenv.config();

const migrate = async () => {
  const client = await pool.connect();
  try {
    console.log('🚀 Ejecutando migraciones...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS stations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        description TEXT,
        stream_url TEXT NOT NULL,
        logo_url TEXT,
        genre VARCHAR(50),
        language VARCHAR(30) DEFAULT 'Español',
        bitrate INTEGER DEFAULT 128,
        is_active BOOLEAN DEFAULT true,
        listener_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS song_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        station_id UUID REFERENCES stations(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        artist VARCHAR(200),
        album VARCHAR(200),
        played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS listeners (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        station_id UUID REFERENCES stations(id) ON DELETE CASCADE,
        session_id VARCHAR(100) NOT NULL,
        connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        disconnected_at TIMESTAMP WITH TIME ZONE,
        user_agent TEXT,
        ip_address INET
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        station_id UUID REFERENCES stations(id) ON DELETE CASCADE,
        username VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Insertar estaciones de ejemplo con streams reales y públicos
    await client.query(`
      INSERT INTO stations (name, description, stream_url, genre, language, bitrate) 
      VALUES 
        ('Radio Jazz Global', 'Jazz suave 24/7 para tu ambiente', 'https://stream.radioparadise.com/mellow-320', 'Jazz', 'Inglés', 320),
        ('Electronic Beats', 'Música electrónica no-stop', 'https://stream.radioparadise.com/rock-320', 'Rock', 'Inglés', 320),
        ('Classical 24', 'Lo mejor de la música clásica', 'https://stream.radioparadise.com/eclectic-320', 'Clásica', 'Internacional', 320)
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Migraciones completadas exitosamente!');
    console.log('✅ Estaciones de ejemplo insertadas');
  } catch (error) {
    console.error('❌ Error en migraciones:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

migrate().catch(console.error);
