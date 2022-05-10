import { getProducts, Product } from '@stripe/firestore-stripe-payments'
// import type { NextPage } from 'next'
import Head from 'next/head'
// import Image from 'next/image'
import { useRecoilValue } from 'recoil'
import { movieState } from '../atoms/modalAtom'
import Banner from '../components/Banner'
import Header from '../components/Header'
import Modal from '../components/Modal'
import Plans from '../components/Plans'
import Row from '../components/Row'
// import Spinner from '../components/Spinner'
import useAuth from '../hooks/useAuth'
import { Movie } from '../typings'
import requests from '../utils/requests'
import payments from './../lib/stripe'
import useSubcription from './../hooks/useSubcription'
import useList from './../hooks/useList'

interface Props {
  netflixOriginals: Movie[]
  trendingNow: Movie[]
  topRated: Movie[]
  actionMovies: Movie[]
  comedyMovies: Movie[]
  horrorMovies: Movie[]
  romanceMovies: Movie[]
  documentaries: Movie[]
  products: Product[]
}
const Home = ({
  netflixOriginals,
  actionMovies,
  comedyMovies,
  documentaries,
  horrorMovies,
  romanceMovies,
  topRated,
  trendingNow,
  products,
}: Props) => {
  const { loading, user } = useAuth()
  const showModal = useRecoilValue(movieState)
  const subscription = useSubcription(user)
  const movie = useRecoilValue(movieState)
  const list = useList(user?.uid)

  if (loading || subscription === null) {
    return null
  }

  if (!subscription) {
    return <Plans products={products} />
  }

  return (
    <div className="relative h-screen bg-gradient-to-b lg:h-[140vh]">
      <Head>
        <title>Home - Netflix</title>
        <link
          rel="icon"
          href="https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico"
        />
      </Head>

      {/* Header */}
      <Header />
      <main className="relative pl-4 pb-24 lg:space-y-24 lg:pl-16">
        {/* Banner */}
        <Banner netflixOriginals={netflixOriginals} />
        <section className="md:space-y-24">
          {/* different  Rows */}
          <Row title="Trending Now" movies={trendingNow} />
          <Row title="Top Rated" movies={topRated} />
          <Row title="Action" movies={actionMovies} />

          {/* mylist */}
          {list.length > 0 && <Row title="My List" movies={list} />}

          <Row title="Comedy" movies={comedyMovies} />
          <Row title="Horror" movies={horrorMovies} />
          <Row title="Romance" movies={romanceMovies} />
          <Row title="Documentaries" movies={documentaries} />
        </section>
      </main>
      {/* Modal */}
      {showModal && <Modal />}
    </div>
  )
}

export default Home

export const getServerSideProps = async () => {
  const products = await getProducts(payments, {
    includePrices: true,
    activeOnly: true,
  })
    .then((res) => res)
    .catch((err) => console.log(err.message))

  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
    fetch(requests.fetchTrending).then((res) => res.json()),
    fetch(requests.fetchTopRated).then((res) => res.json()),
    fetch(requests.fetchActionMovies).then((res) => res.json()),
    fetch(requests.fetchComedyMovies).then((res) => res.json()),
    fetch(requests.fetchHorrorMovies).then((res) => res.json()),
    fetch(requests.fetchRomanceMovies).then((res) => res.json()),
    fetch(requests.fetchDocumentaries).then((res) => res.json()),
  ])

  return {
    props: {
      netflixOriginals: netflixOriginals.results,
      trendingNow: trendingNow.results,
      topRated: topRated.results,
      actionMovies: actionMovies.results,
      comedyMovies: comedyMovies.results,
      horrorMovies: horrorMovies.results,
      romanceMovies: romanceMovies.results,
      documentaries: documentaries.results,
      products: products,
    },
  }
}
