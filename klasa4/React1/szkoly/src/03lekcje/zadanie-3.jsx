
function MovieList({movies = []}) {    // np.: { id: 1, title: "Inception", year: 2010, rating: 8.8 }
    return (
        <>
        <ul>
            {movies.map(movie => {
                return ( <li key={movie.id}> {movie.id} {movie.title}. Rok: {movie.year}, rating: {movie.rating} </li>)
            })}
        </ul>
        </>
    )
}

export default MovieList;