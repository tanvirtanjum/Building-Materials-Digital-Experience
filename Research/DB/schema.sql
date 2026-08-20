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


-- 1. Insert Categories (Main and Sub-categories)
INSERT INTO categories (id, parent_id, name) VALUES
(1, NULL, 'Drywall'),
(2, NULL, 'Insulation'),
(3, NULL, 'Plasters & Renders'),
(4, NULL, 'Ceiling Systems'),
(5, 1, 'Standard Boards'),
(6, 1, 'Specialty Boards'),
(7, 2, 'Mineral Wool'),
(8, 2, 'Glass Wool'),
(9, 3, 'Interior Plaster'),
(10, 3, 'Exterior Render');

-- 2. Insert Base Products (Using online placeholder images)
INSERT INTO products (id, name, short_description, brand_division, image_url) VALUES
(1, 'Standard Gypsum Board', 'Basic wallboard for standard interior partitions.', 'BuildCore', 'https://placehold.co/600x400/eeeeee/31343c?text=Standard+Gypsum+Board'),
(2, 'Aqua-Resist Board', 'Moisture-resistant green board for bathrooms and kitchens.', 'BuildCore', 'https://placehold.co/600x400/eeeeee/31343c?text=Aqua-Resist+Board'),
(3, 'Fire-Shield Board', 'Enhanced fire-resistant core for commercial safety.', 'ProSafety', 'https://placehold.co/600x400/eeeeee/31343c?text=Fire-Shield+Board'),
(4, 'Acoustic-Plus Panel', 'Perforated board for superior sound absorption.', 'Acoustics', 'https://placehold.co/600x400/eeeeee/31343c?text=Acoustic-Plus+Panel'),
(5, 'Thermal Glass Wool Roll', 'High thermal efficiency roll for roof insulation.', 'InsulTech', 'https://placehold.co/600x400/eeeeee/31343c?text=Glass+Wool+Roll'),
(6, 'Heavy-Duty Mineral Slab', 'Dense mineral wool for acoustic and fire insulation.', 'InsulTech', 'https://placehold.co/600x400/eeeeee/31343c?text=Mineral+Slab'),
(7, 'Eco-Friendly Hemp Roll', 'Sustainable natural insulation for green building.', 'EcoBuild', 'https://placehold.co/600x400/eeeeee/31343c?text=Hemp+Roll'),
(8, 'Ultra-Light Ceiling Tile', 'Lightweight grid ceiling tile for offices.', 'CeilingsPro', 'https://placehold.co/600x400/eeeeee/31343c?text=Ceiling+Tile'),
(9, 'Acoustic Baffle', 'Hanging sound absorber for large open spaces.', 'Acoustics', 'https://placehold.co/600x400/eeeeee/31343c?text=Acoustic+Baffle'),
(10, 'Ready-Mix Finish Plaster', 'Smooth, ready-to-use white interior plaster.', 'PlasterPro', 'https://placehold.co/600x400/eeeeee/31343c?text=Finish+Plaster'),
(11, 'Tough Exterior Render', 'Weather-proof cement-based render for facades.', 'PlasterPro', 'https://placehold.co/600x400/eeeeee/31343c?text=Exterior+Render'),
(12, 'Magnetic Wall Board', 'Specialty board that holds magnets for classrooms.', 'BuildCore', 'https://placehold.co/600x400/eeeeee/31343c?text=Magnetic+Board'),
(13, 'Lead-Lined X-Ray Board', 'Radiation protection board for hospitals.', 'ProSafety', 'https://placehold.co/600x400/eeeeee/31343c?text=X-Ray+Board'),
(14, 'Floor Sound Mat', 'Thin underlayment to stop impact noise on floors.', 'Acoustics', 'https://placehold.co/600x400/eeeeee/31343c?text=Floor+Sound+Mat'),
(15, 'Quick-Set Patching Compound', 'Fast-drying powder for repairing drywall holes.', 'PlasterPro', 'https://placehold.co/600x400/eeeeee/31343c?text=Patching+Compound');

-- 3. Map Products to Categories
INSERT INTO product_category_mapping (product_id, category_id) VALUES
(1, 1), (1, 5),
(2, 1), (2, 6),
(3, 1), (3, 6),
(4, 1), (4, 6), (4, 4),
(5, 2), (5, 8),
(6, 2), (6, 7),
(7, 2),
(8, 4),
(9, 4),
(10, 3), (10, 9),
(11, 3), (11, 10),
(12, 1), (12, 6),
(13, 1), (13, 6),
(14, 2),
(15, 3), (15, 9);

-- 4. Insert Product Variants (SKUs with different sizes/weights)
INSERT INTO product_variants (product_id, sku, length_mm, width_mm, thickness_mm, weight_kg) VALUES
(1, 'DRY-STD-01', 2400, 1200, 12.5, 24.0), (1, 'DRY-STD-02', 3000, 1200, 12.5, 30.0), (1, 'DRY-STD-03', 2400, 1200, 15.0, 30.0),
(2, 'DRY-AQA-01', 2400, 1200, 12.5, 25.5), (2, 'DRY-AQA-02', 3000, 1200, 12.5, 32.0),
(3, 'DRY-FIR-01', 2400, 1200, 15.0, 31.0), (3, 'DRY-FIR-02', 3000, 1200, 15.0, 39.0),
(4, 'DRY-ACO-01', 2400, 1200, 12.5, 26.0), (4, 'DRY-ACO-02', 2000, 1200, 12.5, 22.0),
(5, 'INS-GLS-01', 5000, 1200, 100.0, 12.0), (5, 'INS-GLS-02', 4000, 1200, 150.0, 15.0),
(6, 'INS-MIN-01', 1200, 600, 50.0, 5.0), (6, 'INS-MIN-02', 1200, 600, 100.0, 10.0),
(7, 'INS-ECO-01', 4000, 600, 100.0, 8.0),
(8, 'CEL-TIL-01', 600, 600, 15.0, 2.0), (8, 'CEL-TIL-02', 1200, 600, 15.0, 4.0),
(9, 'CEL-BAF-01', 1200, 300, 40.0, 3.5),
(10, 'PLS-INT-01', NULL, NULL, NULL, 10.0), (10, 'PLS-INT-02', NULL, NULL, NULL, 20.0),
(11, 'PLS-EXT-01', NULL, NULL, NULL, 25.0),
(12, 'DRY-MAG-01', 2400, 1200, 12.5, 35.0),
(13, 'DRY-XRY-01', 2400, 625, 12.5, 45.0),
(14, 'INS-MAT-01', 10000, 1000, 5.0, 15.0),
(15, 'PLS-PAT-01', NULL, NULL, NULL, 5.0);

-- 5. Insert Technical Attributes
INSERT INTO technical_attributes (product_id, attribute_name, attribute_value) VALUES
(1, 'Application Area', 'Interior Wall'), (1, 'Fire Rating', 'Standard'), (1, 'Moisture Resistant', 'No'),
(2, 'Application Area', 'Wet Room'), (2, 'Fire Rating', 'Standard'), (2, 'Moisture Resistant', 'Yes'),
(3, 'Application Area', 'Interior Wall'), (3, 'Fire Rating', 'Non-Combustible (A1)'), (3, 'Moisture Resistant', 'No'),
(4, 'Application Area', 'Ceiling'), (4, 'Acoustic Rating', 'High'), (4, 'Fire Rating', 'Standard'),
(5, 'Application Area', 'Roof'), (5, 'Thermal Conductivity', '0.032 W/mK'), (5, 'Material', 'Glass Wool'),
(6, 'Application Area', 'Exterior Wall'), (6, 'Fire Rating', 'Non-Combustible (A1)'), (6, 'Acoustic Rating', 'High'),
(7, 'Application Area', 'Roof'), (7, 'Material', 'Natural Hemp'), (7, 'Eco-Friendly', 'Yes'),
(8, 'Application Area', 'Ceiling'), (8, 'Material', 'Mineral Fiber'), (8, 'Moisture Resistant', 'Yes'),
(9, 'Application Area', 'Ceiling'), (9, 'Acoustic Rating', 'Very High'),
(10, 'Application Area', 'Interior Wall'), (10, 'Ready to Use', 'Yes'),
(11, 'Application Area', 'Exterior Wall'), (11, 'Moisture Resistant', 'Yes'),
(12, 'Application Area', 'Interior Wall'), (12, 'Magnetic', 'Yes'),
(13, 'Application Area', 'Hospital/Clinic'), (13, 'Radiation Protection', 'Yes'),
(14, 'Application Area', 'Floor'), (14, 'Acoustic Rating', 'High'),
(15, 'Application Area', 'Interior Wall'), (15, 'Setting Time', '30 Minutes');

-- 6. Insert Documents (Using public W3C sample PDF links)
INSERT INTO documents (product_id, document_type, file_url) VALUES
(1, 'Technical Data Sheet', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
(2, 'Technical Data Sheet', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
(3, 'Safety Data Sheet', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
(3, 'Fire Certificate', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
(5, 'Thermal Certificate', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
(11, 'Application Guide', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
(13, 'Radiation Compliance', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');