import { AsyncStorage } from 'react-native';

export async function getToken(){
    return await  AsyncStorage.getItem('token')
}