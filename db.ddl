DROP SCHEMA IF EXISTS twa;

CREATE SCHEMA twa;
USE twa;

CREATE TABLE classroom (
                           id BIGINT AUTO_INCREMENT PRIMARY KEY,
                           code VARCHAR(4) NOT NULL,
                           name VARCHAR(20) NOT NULL,
                           energy_watt DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
                           score SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE building (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(20) NOT NULL,
                          cost_watt DECIMAL(20, 2) NOT NULL,
                          reward SMALLINT NOT NULL,
                          image JSON
);

CREATE TABLE classroom_power_building (
                                          classroom_id BIGINT,
                                          building_id BIGINT,
                                          FOREIGN KEY (classroom_id) REFERENCES classroom(id) ON DELETE CASCADE,
                                          FOREIGN KEY (building_id) REFERENCES building(id) ON DELETE CASCADE
);

CREATE TABLE user (
                      id BIGINT AUTO_INCREMENT PRIMARY KEY,
                      username VARCHAR(128) NOT NULL,
                      email VARCHAR(128) NOT NULL UNIQUE,
                      password VARCHAR(128) NOT NULL,
                      archived BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE camp (
                      id INT AUTO_INCREMENT PRIMARY KEY,
                      title VARCHAR(255) NOT NULL,
                      start_date DATE NOT NULL,
                      end_date DATE NOT NULL,
                      start_time TIME NOT NULL,
                      end_time TIME NOT NULL,
                      starting_age INT NOT NULL,
                      ending_age INT NOT NULL,
                      location VARCHAR(255) NOT NULL,
                      content JSON NOT NULL,
                      archived BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE workshop (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          archived BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE component (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           workshop_id INT NOT NULL,
                           type ENUM('titel', 'stappen', 'link', 'afbeelding', 'tekst', 'subtitel') NOT NULL,
                           content JSON NOT NULL,
                           FOREIGN KEY (workshop_id) REFERENCES workshop(id) ON DELETE CASCADE
);

CREATE TABLE workshop_component (
                                    workshop_id INT,
                                    component_id INT,
                                    position INT NOT NULL,
                                    PRIMARY KEY (workshop_id, component_id),
                                    FOREIGN KEY (workshop_id) REFERENCES workshop(id) ON DELETE CASCADE,
                                    FOREIGN KEY (component_id) REFERENCES component(id) ON DELETE CASCADE,
                                    UNIQUE (workshop_id, position)
);

-- Junction table for camp and Workshop many-to-many relationship
CREATE TABLE camp_workshop (
                               camp_id INT,
                               workshop_id INT,
                               PRIMARY KEY (camp_id, workshop_id),
                               FOREIGN KEY (camp_id) REFERENCES camp(id) ON DELETE CASCADE,
                               FOREIGN KEY (workshop_id) REFERENCES workshop(id) ON DELETE CASCADE,
                               position INT NOT NULL
);

CREATE TABLE slider (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        multiplier INT
);

CREATE TABLE password_resets (
                                 id INT AUTO_INCREMENT PRIMARY KEY,
                                 email VARCHAR(255) NOT NULL,
                                 token VARCHAR(255) NOT NULL,
                                 expires DATETIME NOT NULL
);

SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS clean_expired_resets
ON SCHEDULE EVERY 1 MINUTE
DO
DELETE FROM password_resets WHERE expires < NOW();


DROP TRIGGER IF EXISTS after_workshop_delete;
DELIMITER $$
CREATE TRIGGER after_workshop_delete
    AFTER DELETE ON workshop
    FOR EACH ROW
BEGIN
    DELETE FROM component WHERE workshop_id = OLD.id;
    END$$
    DELIMITER ;