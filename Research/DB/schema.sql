CREATE DATABASE IF NOT EXISTS knauf_catalog;
USE knauf_catalog;

-- 1. Categories Table (Supports hierarchical categories like Platten -> Gipsplatten)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT DEFAULT NULL,
    name VARCHAR(100) NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 2. Base Products Table (Now includes image_url)
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_description TEXT,
    brand_division VARCHAR(100),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Product-to-Category Mapping (Many-to-Many Bridge)
CREATE TABLE product_category_mapping (
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 4. Product Variants (The physical dimensions/SKUs contractors buy)
CREATE TABLE product_variants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    length_mm INT,
    width_mm INT,
    thickness_mm DECIMAL(5,2),
    weight_kg DECIMAL(6,2),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 5. Technical Attributes (Flexible EAV table for filters like Fire Rating)
CREATE TABLE technical_attributes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    attribute_name VARCHAR(100) NOT NULL,
    attribute_value VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 6. Documents (PDF data sheets)
CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    document_type VARCHAR(100) NOT NULL, 
    file_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);