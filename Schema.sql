CREATE TABLE `Users` (
    `user_id` CHAR(36) NOT NULL DEFAULT (UUID()),
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password_hash` TEXT NOT NULL,
    `profile_picture` TEXT NULL,
    `phone` VARCHAR(20) NULL,
    `is_verified` BOOLEAN DEFAULT FALSE,
    `role` VARCHAR(50) DEFAULT 'User',
    `status` VARCHAR(50) DEFAULT 'Active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`)
);

CREATE TABLE `Votes` (
    `vote_id` CHAR(36) NOT NULL DEFAULT (UUID()),
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `status` VARCHAR(50) DEFAULT 'Active', -- Active, Closed
    `created_by` CHAR(36) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `expires_at` TIMESTAMP NOT NULL,
    PRIMARY KEY (`vote_id`),
    FOREIGN KEY (`created_by`) REFERENCES `Users`(`user_id`)
);

CREATE TABLE `Options` (
    `option_id` CHAR(36) NOT NULL DEFAULT (UUID()),
    `vote_id` CHAR(36) NOT NULL,
    `content` VARCHAR(255) NOT NULL,
    `votes_count` INT DEFAULT 0, -- Optional: để lưu kết quả tối ưu
    PRIMARY KEY (`option_id`),
    FOREIGN KEY (`vote_id`) REFERENCES `Votes`(`vote_id`) ON DELETE CASCADE
);

CREATE TABLE `UserVotes` (
    `user_vote_id` CHAR(36) NOT NULL DEFAULT (UUID()),
    `user_id` CHAR(36) NOT NULL,
    `option_id` CHAR(36) NOT NULL,
    `voted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_vote_id`),
    FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`option_id`) REFERENCES `Options`(`option_id`) ON DELETE CASCADE
);
