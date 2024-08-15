import React, {Component} from "react";
import {Route, Routes} from "react-router-dom";
import NotFound from "../component/NotFound";
import Index from "../views"
import Post from "../pages/post";
import Main from "../pages/main";
import Mine from "../pages/Mine";
import Register from "../pages/Register";
import AddOrEditPost from "../pages/AddOrEditPost";
import DataListByUser from "../pages/PostManagement";
import Test from "../pages/test";
import Claim from "../pages/Claim";

class MainRouter extends Component{
    render() {
        return(
            <Routes>
                <Route path="/" element={<Index/>}/>
                <Route path="/index" element={<Index/>}>
                    <Route index element={<Main/>}/>
                    <Route path={"post/:pid"} element={<Post/>}/>
                    <Route path="mine" element={<Mine/>}/>
                    <Route path="register" element={<Register/>}/>
                    <Route path="addPost" element={<AddOrEditPost/>}/>
                    <Route path="edit" element={<DataListByUser/>}/>
                    <Route path={"claim"} element={<Claim/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Route>
                <Route path="/test" element={<Test />}/>
                <Route path="*" element={<NotFound />}/>
            </Routes>
        )
    }
}

export default MainRouter;