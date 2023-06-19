import pymysql

class BDManipulator:
    def __init__(self, host, user, password, database, port=3306):
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.port = port
        self.connection = None
        self.cursor = None

    def connect(self):
        self.connection = pymysql.connect(
            host=self.host,
            port=self.port,
            user=self.user,
            password=self.password,
            database=self.database
        )
        self.cursor = self.connection.cursor()

    def disconnect(self):
        if self.connection and self.cursor:
            self.cursor.close()
            self.connection.close()

    def insert_data(self, value, topico, qos, created_at):
        created_at
        insert_query = "INSERT INTO alert_perimeter_break(value, topico, qos, created_at) VALUES(%s, %s, %s, %s)"
        self.cursor.execute(insert_query, (value, topico, qos, created_at))
        self.connection.commit()
