USE messaging_web_app_db;
-- DEFAULT DATA
INSERT INTO users		SET id='0000-0000-0000-0000-0000', pseudo='kim', email='', first_name='Kim', last_name='Jong Un', creation_time=CURRENT_TIMESTAMP(), active=1, enabled=1;
INSERT INTO users		SET id='1111-1111-1111-1111-1111', pseudo='donald', email='', first_name='Donald', last_name='Trump', creation_time=CURRENT_TIMESTAMP(), active=1, enabled=1;
INSERT INTO users		SET id='2222-2222-2222-2222-2222', pseudo='vladimir', email='', first_name='Vladimir', last_name='Poutine', creation_time=CURRENT_TIMESTAMP(), active=1, enabled=1;
INSERT INTO users		SET id='3333-3333-3333-3333-3333', pseudo='user', email='', first_name='user', last_name='user', creation_time=CURRENT_TIMESTAMP(), active=1, enabled=1;

-- groups
INSERT INTO groups	SET id='twitter_group', creation_time=CURRENT_TIMESTAMP(), `name`='twitter group', `type`='group', administrator='0000-0000-0000-0000-0000', active=1;

INSERT INTO user_groups	SET USER='0000-0000-0000-0000-0000', `group`='twitter_group', creation_time=CURRENT_TIMESTAMP(), active=1;
INSERT INTO user_groups	SET USER='1111-1111-1111-1111-1111', `group`='twitter_group', creation_time=CURRENT_TIMESTAMP(), active=1;
INSERT INTO user_groups	SET USER='2222-2222-2222-2222-2222', `group`='twitter_group', creation_time=CURRENT_TIMESTAMP(), active=1;
INSERT INTO user_groups	SET USER='3333-3333-3333-3333-3333', `group`='twitter_group', creation_time=CURRENT_TIMESTAMP(), active=1;

-- tokens
INSERT INTO tokens 		SET id=UUID(), value='1234-1234-1234-1234-1234', type='session', expiration_time=CURRENT_TIMESTAMP(), active=1, user='0000-0000-0000-0000-0000';
INSERT INTO tokens 		SET id=UUID(), value='2345-2345-2345-2345-2345', type='session', expiration_time=CURRENT_TIMESTAMP(), active=1, user='1111-1111-1111-1111-1111';
INSERT INTO tokens 		SET id=UUID(), value='3456-3456-3456-3456-3456', type='session', expiration_time=CURRENT_TIMESTAMP(), active=1, user='2222-2222-2222-2222-2222';
INSERT INTO tokens 		SET id=UUID(), value='4567-4567-4567-4567-4567', type='session', expiration_time=CURRENT_TIMESTAMP(), active=1, user='3333-3333-3333-3333-3333';
