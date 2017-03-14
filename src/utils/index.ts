import {
    AsyncStorage
} from 'react-native'
import { ITrack } from '../services/api'
import RNFS from 'react-native-fs'

export const DOWNLOADED_TRACKS = 'DOWNLOADED_TRACKS'

export const PLACEHOLDER_IMAGE = 'http://p4.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=30y30'

export const FILES_FOLDER = `${RNFS.DocumentDirectoryPath}/files`

export async function getDownloadedTracks (): Promise<ITrack[]> {
  const tracks = await AsyncStorage.getItem(DOWNLOADED_TRACKS)
  return tracks ? JSON.parse(tracks) : []
}

export function assign<A extends B, B extends Object>(source: A, assignments: B): A {
  return Object.assign({}, source, assignments)
}
