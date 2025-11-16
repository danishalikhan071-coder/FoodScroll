import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'

const Home = () => {
    const [ videos, setVideos ] = useState([])
    const navigate = useNavigate()
    // Autoplay behavior is handled inside ReelFeed

    useEffect(() => {
        axios.get("http://localhost:3000/api/food", { withCredentials: true })
            .then(response => {
                setVideos(response.data.foodItems)
            })
            .catch((error) => {
                if (error.response?.status === 401) {
                    // User is not authenticated, redirect to login
                    navigate('/user/login')
                }
            })
    }, [navigate])

    // Using local refs within ReelFeed; keeping map here for dependency parity if needed

    async function likeVideo(item) {
        try {
            const response = await axios.post("http://localhost:3000/api/food/like", { foodId: item._id }, {withCredentials: true})

            if(response.data.like){
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v))
            }else{
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v))
            }
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/user/login')
            }
        }
    }

    async function saveVideo(item) {
        try {
            const response = await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true })
            
            if(response.data.save){
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v))
            }else{
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v))
            }
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/user/login')
            }
        }
    }

    return (
        <ReelFeed
            items={videos}
            onLike={likeVideo}
            onSave={saveVideo}
            emptyMessage="No videos available."
        />
    )
}

export default Home