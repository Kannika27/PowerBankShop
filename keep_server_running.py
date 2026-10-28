import paramiko
import time
import socket
import sys

# 1. Guarantee single instance using a local socket lock
lock_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
try:
    lock_socket.bind(('127.0.0.1', 49152))
except socket.error:
    # Another instance is already running
    sys.exit(0)

host = '119.59.102.161'
port = 2222
user = 'std6730251000'
password = 'nZ!4pQrt'

print("PowerBank persistent server runner started.")

while True:
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(host, port=port, username=user, password=password, timeout=15, banner_timeout=30)
        chan = ssh.invoke_shell()
        time.sleep(2)
        if chan.recv_ready():
            chan.recv(4096)
        
        print("Connected to SSH. Launching node server.js...")
        chan.send("cd /app && node server.js\n")
        
        while True:
            if chan.recv_ready():
                data = chan.recv(4096).decode('utf-8', errors='ignore')
            time.sleep(1)
            
    except Exception as e:
        print(f"Connection dropped: {e}. Reconnecting in 3 seconds...")
        time.sleep(3)
