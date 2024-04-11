# QualityAnalyzer

## .env
```dotenv
# CONSOLE OPTION
PRINT_DEBUG=true
PRINT_STACK_DETAIL=true
CONSOLE_LOCALE='en-GB'
CONSOLE_TIMEZONE='Europe/London'

# DATABASE
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=WeinzbernJ2!
MYSQL_DATABASE=QualityAnalyzer
MYSQL_LIMIT=5

# API RELATED
RAPID_KEY=
```

## SQL Structure
```sql
create table if not exists question
(
    qID    int auto_increment
    primary key,
    qTitle varchar(50)  null,
    qMain  varchar(200) null,
    qTopic varchar(100) null
    );

create table if not exists user
(
    uID       int auto_increment,
    uName     varchar(50) not null,
    uPassword varchar(50) null,
    uStatus   tinyint     null,
    constraint user_pk
    unique (uID),
    constraint user_pk_2
    unique (uName)
    );
```
## Pre-Fill Data
```sql
INSERT INTO QualityAnalyzer.question (qID, qTitle, qMain, qTopic) VALUES (1, 'Study climate change', 'You need to study climate change. Which aspect of climate change will you choose and why? Use examples.', 'study|climate|change|extreme|weather|agriculture|disaster|global|warming|ecology|temperature|emissio');
INSERT INTO QualityAnalyzer.question (qID, qTitle, qMain, qTopic) VALUES (2, 'Environment pollution', 'Write about environment pollution. Who is responsible: government, companies or industries?', 'environment|business|pollution|organization|company|government|responsible|policy|individual|industr');
INSERT INTO QualityAnalyzer.question (qID, qTitle, qMain, qTopic) VALUES (3, 'Education', '"The only thing that interfere with my learning is my education" Einstein. What does he mean by that? And do you think he is correct?', 'education|learning|skill|knowledge|theoretical|practical|imagination|creativity|exam|development|met');
INSERT INTO QualityAnalyzer.question (qID, qTitle, qMain, qTopic) VALUES (4, 'Accomplishing goals', 'Do you think the place where a person grew up helps him/her in accomplishing goals in life? Give an example of a famous person to explain it.', 'environment|effect|behavior|personality|financial|support|education|horizon|development|individual|e');
INSERT INTO QualityAnalyzer.question (qID, qTitle, qMain, qTopic) VALUES (5, 'Television', 'Television has many useful functions to play in everyone\'s life, for some its relaxation, for some it is companion. Discuss your viewpoint and support your answer with examples and discussion point.', 'television|information|companion|channel|time|entertaining|age|news|programs|functions|relaxation');
INSERT INTO QualityAnalyzer.question (qID, qTitle, qMain, qTopic) VALUES (6, 'Learning a new language', 'Learning a new language at an early age is helpful for children. Is it more positive for their future aspect or have some adverse effects?', 'early|age|language|acquisition|easy|brain|development|competitiveness|career|pressure|time|overload|');
INSERT INTO QualityAnalyzer.question (qID, qTitle, qMain, qTopic) VALUES (7, 'Company\'s top-level authorities', 'Company\'s top-level authorities should get their employees in decision-making process. Discuss.', 'top-level|satisfaction|employee|decision|process|management|incentive|time|consensus|authority|compa');
INSERT INTO QualityAnalyzer.question (qID, qTitle, qMain, qTopic) VALUES (8, 'Compulsory voting', 'In some countries around the world, voting is compulsory. Do you agree with the notion of compulsory voting?', 'voting|compulsory|politic|citizen|right|democracy|population|government|election|candidate|fair|coun');
INSERT INTO QualityAnalyzer.question (qID, qTitle, qMain, qTopic) VALUES (9, 'Large shopping malls replacing small shops', 'Large shopping malls are replacing small shops. What is your opinion about this? Discuss with appropriate examples.', 'shopping|mall|shop|price|affordable|choice|facility|employment|traffic|parking|distance|rural|large|');
INSERT INTO QualityAnalyzer.question (qID, qTitle, qMain, qTopic) VALUES (10, 'Work-life balance', 'It is important to maintain the balance between work and other aspects of one\'s life such as family and leisure activities. Please give your opinion about how important to maintain the balance and why', 'balance|work|life|family|stress|competition|connection|online|productive|time');

INSERT INTO aqa.user (uID, uName, uPassword, uStatus) VALUES (1, 'test', 'test', 1);
```