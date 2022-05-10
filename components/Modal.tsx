import {
  CheckIcon,
  ThumbUpIcon,
  VolumeOffIcon,
  VolumeUpIcon,
  XIcon,
} from '@heroicons/react/outline'
import { PlusIcon } from '@heroicons/react/solid'
import MuiModal from '@mui/material/Modal'
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { FaPause, FaPlay } from 'react-icons/fa'
import ReactPlayer from 'react-player/lazy'
import { useRecoilState } from 'recoil'
import { modalState, movieState } from '../atoms/modalAtom'
import { db } from '../firebase'
import useAuth from '../hooks/useAuth'
import { Element, Genre, Movie } from '../typings'

const Modal = () => {
  const [showModal, setShowModal] = useRecoilState(modalState)
  const [movie, setMovie] = useRecoilState(movieState)
  const [trailer, setTrailer] = useState('')
  const [genres, setGenres] = useState<Genre[]>([])
  const [muted, setMuted] = useState(false)
  const { user } = useAuth()
  const [play, setPlay] = useState(true)
  const [addedToList, setAddedToList] = useState(false)
  const [movies, setMovies] = useState<DocumentData[] | Movie[]>([])

  const toastStyle = {
    background: 'white',
    color: 'black',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '15px',
    borderRadius: '9999px',
    maxWidth: '1000px',
  }

  useEffect(() => {
    if (!movie) return

    const fetchMovie = async () => {
      const data = await fetch(
        `https://api.themoviedb.org/3/${
          movie?.media_type === 'tv' ? 'tv' : 'movie'
        }/${movie?.id}?api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }&language=en-US&append_to_response=videos`
      ).then((res) => res.json())

      if (data?.videos) {
        const index = data.videos.results.findIndex(
          (element: Element) => element.type === 'Trailer'
        )
        setTrailer(data.videos?.results[index]?.key)
      }
      //   console.log(data, 'data')

      if (data?.genres) {
        setGenres(data.genres)
      }
    }
    fetchMovie()
  }, [movie])

  // finding all the movies in the user's list
  useEffect(() => {
    if (user) {
      return onSnapshot(
        collection(db, 'customers', user.uid, 'myList'),
        (snapShot) => setMovies(snapShot.docs)
      )
    }
  }, [doc, movie?.id])

  // checking if the movie is already in the user's list
  useEffect(() => {
    setAddedToList(
      movies.findIndex((result) => result.data().id === movie?.id) !== -1
    )
  }, [movies])

  const handleClose = () => {
    setShowModal(false)
  }

  const handleList = async () => {
    if (addedToList) {
      await deleteDoc(
        doc(db, 'customers', user!.uid, 'myList', movie?.id.toString()!)
      )

      toast(
        `${movie?.title || movie?.original_name} has been removed from My List`,
        { duration: 8000, style: toastStyle }
      )
    } else {
      await setDoc(
        doc(db, 'customers', user!.uid, 'myList', movie?.id.toString()!),
        { ...movie }
      )

      toast(
        `${movie?.title || movie?.original_name} has been added to My List`,
        { duration: 8000, style: toastStyle }
      )
    }
  }
  return (
    <MuiModal
      open={showModal}
      onClose={handleClose}
      className="fixed !bottom-7 !top-4 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
    >
      <>
        <Toaster position="bottom-center" />
        <button
          onClick={handleClose}
          className="modalButton absolute right-5 top-5 !z-40 h-8 w-8 border-none bg-[#181818] hover:bg-[#181818]"
        >
          <XIcon className="h-5 w-5" />{' '}
        </button>

        <div className="relative pt-[56.25%]">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${trailer}`}
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: '0 ', left: '0' }}
            playing={play}
            muted={muted}
          />

          <div className="absolute bottom-7 flex w-full items-center justify-between px-10">
            <div className="flex space-x-2">
              {play ? (
                <button
                  onClick={() => setPlay(false)}
                  className="flex items-center gap-x-2 rounded bg-white px-8 text-xl font-bold text-black transition hover:bg-[#e6e6e6]"
                >
                  <FaPause className="h-5 w-5 text-black" />
                  Pause
                </button>
              ) : (
                <button
                  onClick={() => setPlay(true)}
                  className="flex items-center gap-x-2 rounded bg-white px-8 text-xl font-bold text-black transition hover:bg-[#e6e6e6]"
                >
                  <FaPlay className="h-5 w-5 text-black" />
                  Play
                </button>
              )}

              <button className="modalButton" onClick={handleList}>
                {addedToList ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  <PlusIcon className="h-5 w-5" />
                )}
              </button>

              <button className="modalButton">
                <ThumbUpIcon className="h-5 w-5" />
              </button>
            </div>

            <button
              className="modalButton"
              onClick={() => {
                setMuted(!muted)
              }}
            >
              {muted ? (
                <VolumeOffIcon className="h-5 w-5" />
              ) : (
                <VolumeUpIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex space-x-16 rounded-b-md bg-[#181818] px-10 py-8">
          <div className="space-y-6 text-lg ">
            <div className="flex items-center space-x-2 text-sm">
              <p className="font-semibold text-green-400">
                {movie?.vote_average * 10}% Match
              </p>
              <p className="font-light">
                {movie?.release_date || movie?.first_air_date}
              </p>
              <div className="flex h-4 justify-center rounded border border-white/40 px-1 text-xs">
                HD
              </div>
            </div>

            <div className="flex flex-col gap-x-10 gap-y-4 font-light md:flex-row">
              <p className="w-4/6">{movie?.overview}</p>
              <div className="flex flex-col space-y-3 text-sm">
                <div>
                  <span className="text-[gray]">Genres: </span>
                  {genres.map((genre) => genre.name).join(', ')}
                </div>

                <div>
                  <span className="text-[gray]">Original Language: </span>
                  {movie?.original_language}
                </div>

                <div>
                  <span className="text-[gray]">Vote count : </span>
                  {movie?.vote_count}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </MuiModal>
  )
}

export default Modal
