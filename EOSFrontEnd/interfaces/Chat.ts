import { Service } from "./Service";
import { User } from "./User";
import { IMessage as IGiftedMessage } from 'react-native-gifted-chat';

export interface IRoom {
  _id: string;
  user: User;
  service: Service;
}

export interface IMessage {
    _id: string;
    roomId: string;
    userId: string;
    text: string;
    createdAt: Date;
}

export function toGiftedMessage(message: IMessage, user: User): IGiftedMessage {
    return {
        _id: message._id,
        text: message.text,
        createdAt: message.createdAt,
        user: {_id: user.uid, name: user.name}
    }
}

export function toIMessage(message: IGiftedMessage, roomId: string): IMessage {
    return {
        _id: message._id.toString(),
        text: message.text,
        createdAt: new Date(message.createdAt),
        userId: message.user._id.toString(),
        roomId: roomId
    }
}