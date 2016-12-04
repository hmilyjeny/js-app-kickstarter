import { forEach } from 'lodash';
import { provideSingleton } from '../../../../ioc/ioc';
import { ISocketConnectedUsers } from './ISocketConnectedUsers';
import TYPES from '../../../../constant/types';
import { User } from '../../../../model/infrastructure/User';
import { string } from 'joi';


interface mapEntity {
    user: User,
    socketSessions: {[socketSessionId: string]: SocketIO.Socket}
}

@provideSingleton(TYPES.ISocketConnectedUsers)
export class SocketConnectedUsers implements ISocketConnectedUsers {

    private usersSocketSessions: {[userId: string]: mapEntity };

    public constructor() {
        this.usersSocketSessions = {};
    }

    public attachSocketSessionToUser(user: User, socketSession: SocketIO.Socket): void {
        this.getAndCreateMapEntry(user).socketSessions[socketSession.id] = socketSession;
    }

    public detachUserFromSocketSession(socketSession: SocketIO.Socket, user: User): void {
        delete(this.getAndCreateMapEntry(user).socketSessions[socketSession.id]);
    }

    public getUserBySocketSessionId(anSocketSessionId: string): User {
        return undefined;
    }

    public getUserSocketSessions(user: User): SocketIO.Socket[] {
        const sessions: SocketIO.Socket[] = [];
        for (const socketId in this.getAndCreateMapEntry(user).socketSessions) {
            if (this.getAndCreateMapEntry(user).socketSessions.hasOwnProperty(socketId)) {
                sessions.push(this.getAndCreateMapEntry(user).socketSessions[socketId]);
            }
        }

        return sessions;
    }

    private getAndCreateMapEntry(user: User): mapEntity {
        const userId: string = user._id.toString();
        if (!this.usersSocketSessions.hasOwnProperty(userId)) {
            this.usersSocketSessions[userId] = {
                user,
                socketSessions: {}
            }
        }
        return this.usersSocketSessions[userId];
    }

}