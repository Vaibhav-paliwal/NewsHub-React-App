import React from "react";
import {useEffect, useState} from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props)=> {
  const[articles, setArticles] = useState([])
  const[loading, setLoading] = useState(true)
  const[page, setPage] = useState(1)
  const[totalResults, setTotalResults] = useState(0)

  const capitalizerFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews= async()=>{
    props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&pageSize=${props.pageSize}`;
    setLoading(true)
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setArticles(json.articles)
        setLoading(false)
        setTotalResults(json.totalResults)
      });
      props.setProgress(100);
  }

  useEffect(() => {
    document.title = `NewsHub- ${capitalizerFirstLetter(
      props.category
    )}`;
    updateNews(); 
    // eslint-disable-next-line
  }, [])
  

  // Yeh render method ke run hone ke baad run hoga.(Sabse pehle constructor run hoga, then render run hoga, then componentDidMount run hoga)
  // const componentDidMount = ()=> {
  //   props.setProgress(10);
  //   let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&pageSize=${props.pageSize}`;
  //   setState({ loading: true });
  //   fetch(url)
  //     .then((res) => res.json())
  //     .then((json) => {
  //       setState({
  //         articles: json.articles,
  //         loading: false,
  //         totalResults: json.totalResults,
  //       });
  //     });
  //     props.setProgress(100);
  // }

  // const handlePrevClick = async () => {
  //   // let url = `https://newsapi.org/v2/top-headlines?country=${
  //   //   props.country
  //   // }&category=${
  //   //   props.category
  //   // }&apiKey=${props.apiKey}&page=${
  //   //   state.page - 1
  //   // }&pageSize=${props.pageSize}`;
  //   // setState({ loading: true });
  //   // fetch(url)
  //   //   .then((res) => res.json())
  //   //   .then((json) => {
  //   //     setState({
  //   //       articles: json.articles,
  //   //       page: state.page - 1,
  //   //       loading: false,
  //   //     });
  //   //   });
  //    setPage(page-1)
  //    updateNews();
  // };
  // const handleNextClick = async () => {
  //   // if (
  //   //   !(
  //   //     state.page + 1 >
  //   //     Math.ceil(state.totalResults / props.pageSize)
  //   //   )
  //   // ) {
  //   //   let url = `https://newsapi.org/v2/top-headlines?country=${
  //   //     props.country
  //   //   }&category=${
  //   //     props.category
  //   //   }&apiKey=${props.apiKey}&page=${
  //   //     state.page + 1
  //   //   }&pageSize=${props.pageSize}`;
  //   //   setState({ loading: true });
  //   //   fetch(url)
  //   //     .then((res) => res.json())
  //   //     .then((json) => {
  //   //       setState({
  //   //         articles: json.articles,
  //   //         page: state.page + 1,
  //   //         loading: false,
  //   //       });
  //   //     });
  //     setPage(page+1)
  //     updateNews();
  // // }
  // };
  // setState({
  //   page: state.page +1,
  // })

  const fetchMoreData = async () => {
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1);
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setArticles(articles.concat(json.articles))
        setTotalResults(json.totalResults)
      });
  };
    return (
      <>
        <h1 className="text-center" style={{ margin: "35px 0px", marginTop:'90px' }}>
          NewsHub- Top {capitalizerFirstLetter(props.category)}{" "}
          Headlines
        </h1>
        {loading && <Spinner/>}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {articles.map((element) => {
                return (
                  <div className="col-md-4" key={element.url}>
                    <NewsItem
                      title={element.title ? element.title : " "}
                      description={
                        element.description ? element.description : ""
                      }
                      imageUrl={element.urlToImage}
                      newsUrl={element.url}
                      author={element.author ? element.author : "Unknown"}
                      date={element.publishedAt}
                      source={element.source.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
            <button
              disabled={state.page <= 1}
              type="button"
              className="btn btn-dark"
              onClick={handlePrevClick}
            >
              &larr; Previous
            </button>
            <button
              disabled={
                state.page + 1 >
                Math.ceil(state.totalResults / props.pageSize)
              }
              type="button"
              className="btn btn-dark"
              onClick={handleNextClick}
            >
              Next &rarr;
            </button>
          </div> */}
      </>
    );
  }



News.defaultProps = {
  country: "in",
  pagesize: 6,
  category: "general",
  totalResults: 0,
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
