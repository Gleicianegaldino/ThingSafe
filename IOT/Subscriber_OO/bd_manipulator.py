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
            database=self.database,
        )
        self.cursor = self.connection.cursor()

    def disconnect(self):
        if self.connection and self.cursor:
            self.cursor.close()
            self.connection.close()

    def insert_alert(self, value, topico, qos, created_at, smart_cone_id):
        created_at
        insert_query = "INSERT INTO alert_perimeter_break(value, topico, qos, created_at, smart_cone_id) VALUES(%s, %s, %s, %s, %s)"
        self.cursor.execute(
            insert_query, (value, topico, qos, created_at, smart_cone_id)
        )
        self.connection.commit()

    def insert_smart_cone(self, mac):
        select_query = "SELECT id FROM smart_cone WHERE mac = %s"
        self.cursor.execute(select_query, (mac,))
        result = self.cursor.fetchone()

        if result is None:
            insert_query = "INSERT INTO smart_cone(mac) VALUES(%s)"
            self.cursor.execute(insert_query, (mac,))
            self.connection.commit()
            return self.cursor.lastrowid
        else:
            return result[0]