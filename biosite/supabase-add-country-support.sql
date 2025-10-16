-- Add country column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS country VARCHAR(2) DEFAULT 'CA';

-- Add country column to listings table
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS country VARCHAR(2) DEFAULT 'CA';

-- Update existing data to set default country
UPDATE users SET country = 'CA' WHERE country IS NULL;
UPDATE listings SET country = 'CA' WHERE country IS NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_users_country ON users(country);
CREATE INDEX IF NOT EXISTS idx_listings_country ON listings(country);

-- Add comment for documentation
COMMENT ON COLUMN users.country IS 'ISO 3166-1 alpha-2 country code (US or CA)';
COMMENT ON COLUMN listings.country IS 'ISO 3166-1 alpha-2 country code (US or CA)';

