import socket
import prediction

HOST = '127.0.0.1'
PORT = 8484
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind((HOST, PORT))
s.listen()





while 1:
    try:
        conn, addr = s.accept()
        print('Connected by', addr)
        data = conn.recv(1024)
    except socket.error:
        print('')
    if data:
        print(data.decode('utf-8'))
        gender = prediction.predict(data.decode('utf-8'))
        
        conn.sendall(gender)
        
        #conn.sendall(b'Hello, client ! Love, Server.')
    conn.close()
