import axios from "axios";
import { useParams } from "react-router-dom";
import React, {useEffect, useState} from "react";
import config from "../../config/config";
import {Avatar, Button, FloatButton, Image, List, message} from 'antd';
import VirtualList from 'rc-virtual-list';
import {AntDesignOutlined, LikeFilled, LikeOutlined, MessageOutlined} from "@ant-design/icons";
import Toys from "../component/Toys";
import jwt_decode from "jwt-decode";
import ClaimDrawer from "../component/ClaimDrawer";

const fakeDataUrl =
    'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
const ContainerHeight = 400;

function IconText(props: {
    icon: React.ForwardRefExoticComponent<Pick<AntdIconProps, "start" | "hidden" | "color" | "content" | "size" | "style" | "default" | "wrap" | "open" | "height" | "rotate" | "translate" | "width" | "multiple" | "disabled" | "cite" | "data" | "form" | "label" | "slot" | "span" | "summary" | "title" | "pattern" | "children" | "key" | "accept" | "acceptCharset" | "action" | "allowFullScreen" | "allowTransparency" | "alt" | "as" | "async" | "autoComplete" | "autoPlay" | "capture" | "cellPadding" | "cellSpacing" | "charSet" | "challenge" | "checked" | "classID" | "cols" | "colSpan" | "controls" | "coords" | "crossOrigin" | "dateTime" | "defer" | "download" | "encType" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget" | "frameBorder" | "headers" | "high" | "href" | "hrefLang" | "htmlFor" | "httpEquiv" | "integrity" | "keyParams" | "keyType" | "kind" | "list" | "loop" | "low" | "manifest" | "marginHeight" | "marginWidth" | "max" | "maxLength" | "media" | "mediaGroup" | "method" | "min" | "minLength" | "muted" | "name" | "noValidate" | "optimum" | "defaultChecked" | "defaultValue" | "suppressContentEditableWarning" | "suppressHydrationWarning" | "accessKey" | "autoFocus" | "className" | "contentEditable" | "contextMenu" | "dir" | "draggable" | "id" | "lang" | "nonce" | "placeholder" | "spellCheck" | "tabIndex" | "radioGroup" | "role" | "about" | "datatype" | "inlist" | "prefix" | "property" | "rel" | "resource" | "rev" | "typeof" | "vocab" | "autoCapitalize" | "autoCorrect" | "autoSave" | "itemProp" | "itemScope" | "itemType" | "itemID" | "itemRef" | "results" | "security" | "unselectable" | "inputMode" | "is" | "aria-activedescendant" | "aria-atomic" | "aria-autocomplete" | "aria-busy" | "aria-checked" | "aria-colcount" | "aria-colindex" | "aria-colspan" | "aria-controls" | "aria-current" | "aria-describedby" | "aria-details" | "aria-disabled" | "aria-dropeffect" | "aria-errormessage" | "aria-expanded" | "aria-flowto" | "aria-grabbed" | "aria-haspopup" | "aria-hidden" | "aria-invalid" | "aria-keyshortcuts" | "aria-label" | "aria-labelledby" | "aria-level" | "aria-live" | "aria-modal" | "aria-multiline" | "aria-multiselectable" | "aria-orientation" | "aria-owns" | "aria-placeholder" | "aria-posinset" | "aria-pressed" | "aria-readonly" | "aria-relevant" | "aria-required" | "aria-roledescription" | "aria-rowcount" | "aria-rowindex" | "aria-rowspan" | "aria-selected" | "aria-setsize" | "aria-sort" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "target" | "type" | "playsInline" | "poster" | "preload" | "readOnly" | "required" | "reversed" | "rows" | "rowSpan" | "sandbox" | "scope" | "scoped" | "scrolling" | "seamless" | "selected" | "shape" | "sizes" | "src" | "srcDoc" | "srcLang" | "srcSet" | "step" | "useMap" | "value" | "wmode" | "dangerouslySetInnerHTML" | "onCopy" | "onCopyCapture" | "onCut" | "onCutCapture" | "onPaste" | "onPasteCapture" | "onCompositionEnd" | "onCompositionEndCapture" | "onCompositionStart" | "onCompositionStartCapture" | "onCompositionUpdate" | "onCompositionUpdateCapture" | "onFocus" | "onFocusCapture" | "onBlur" | "onBlurCapture" | "onChange" | "onChangeCapture" | "onBeforeInput" | "onBeforeInputCapture" | "onInput" | "onInputCapture" | "onReset" | "onResetCapture" | "onSubmit" | "onSubmitCapture" | "onInvalid" | "onInvalidCapture" | "onLoad" | "onLoadCapture" | "onError" | "onErrorCapture" | "onKeyDown" | "onKeyDownCapture" | "onKeyPress" | "onKeyPressCapture" | "onKeyUp" | "onKeyUpCapture" | "onAbort" | "onAbortCapture" | "onCanPlay" | "onCanPlayCapture" | "onCanPlayThrough" | "onCanPlayThroughCapture" | "onDurationChange" | "onDurationChangeCapture" | "onEmptied" | "onEmptiedCapture" | "onEncrypted" | "onEncryptedCapture" | "onEnded" | "onEndedCapture" | "onLoadedData" | "onLoadedDataCapture" | "onLoadedMetadata" | "onLoadedMetadataCapture" | "onLoadStart" | "onLoadStartCapture" | "onPause" | "onPauseCapture" | "onPlay" | "onPlayCapture" | "onPlaying" | "onPlayingCapture" | "onProgress" | "onProgressCapture" | "onRateChange" | "onRateChangeCapture" | "onSeeked" | "onSeekedCapture" | "onSeeking" | "onSeekingCapture" | "onStalled" | "onStalledCapture" | "onSuspend" | "onSuspendCapture" | "onTimeUpdate" | "onTimeUpdateCapture" | "onVolumeChange" | "onVolumeChangeCapture" | "onWaiting" | "onWaitingCapture" | "onAuxClick" | "onAuxClickCapture" | "onClick" | "onClickCapture" | "onContextMenu" | "onContextMenuCapture" | "onDoubleClick" | "onDoubleClickCapture" | "onDrag" | "onDragCapture" | "onDragEnd" | "onDragEndCapture" | "onDragEnter" | "onDragEnterCapture" | "onDragExit" | "onDragExitCapture" | "onDragLeave" | "onDragLeaveCapture" | "onDragOver" | "onDragOverCapture" | "onDragStart" | "onDragStartCapture" | "onDrop" | "onDropCapture" | "onMouseDown" | "onMouseDownCapture" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseMoveCapture" | "onMouseOut" | "onMouseOutCapture" | "onMouseOver" | "onMouseOverCapture" | "onMouseUp" | "onMouseUpCapture" | "onSelect" | "onSelectCapture" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerUp" | "onPointerUpCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerOut" | "onPointerOutCapture" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onScroll" | "onScrollCapture" | "onWheel" | "onWheelCapture" | "onAnimationStart" | "onAnimationStartCapture" | "onAnimationEnd" | "onAnimationEndCapture" | "onAnimationIteration" | "onAnimationIterationCapture" | "onTransitionEnd" | "onTransitionEndCapture" | "spin" | "twoToneColor"> & React.RefAttributes<HTMLSpanElement>>
}) {
    return null;
}



let jwt = sessionStorage.getItem("jwt");
let data = null;

/**
 * 帖子的详情页,通过 /index/post/{pid}访问
 * @returns {Element}
 * @constructor
 */
function Post(){
    let { pid } = useParams();
    const [postData, setPostData] = useState(null);

    useEffect(() => {
        try{
            data = jwt_decode(jwt);
            if(data.uid === null){
                message.warning("请先登录").then(() => {
                    window.location.href = "/index/mine"
                })
            }
        }catch(error){
            console.log('JWT不合法', error);
            message.warning("请先登录").then(() => {
                window.location.href = "/index/mine"
            })
        }
        axios.get(`${config.HTTP_REQUEST_URL}/post/${pid}`)
            .then(response => {
                console.log(response.data)
                setPostData(response.data);
            })
            .catch(err => {
                // 处理错误
                console.error(err)
            });
    }, [pid]);

    if (!postData) {
        return <div>Loading...</div>;
    }


    return (
        <div>
            <h1>{postData.Title}</h1>
            <p>{postData.CreateTime}</p>
            <Image
                width={200}
                src={"/postImage/" + postData.ImageUrl}
                />
            <p>{postData.Content}</p>
            <div style={{textAlign: "center"}}>
                <ClaimDrawer/>
            </div>
            {/* 其他帖子详情内容 */}

            <List>
                <VirtualList
                    data={postData.Comment}
                    height={ContainerHeight}
                    itemHeight={47}
                    itemKey="email"
                    // onScroll={onScroll}
                >
                    {(item) => (
                        <List.Item key={item.email}>
                            <List.Item.Meta
                                avatar={<Avatar src={item.User.ImagePath === null ? "/image/picture.jpg" : "/avatar/"+item.User.ImagePath}
                                                size={"large"}
                                                icon={<AntDesignOutlined />}/>}
                                title={<a href="https://ant.design">{item.User.Name}</a>}
                                description={item.Content}
                            />
                            {/*<div>Content</div>*/}
                        </List.Item>
                    )}
                </VirtualList>
            </List>
            <Toys/>
        </div>
    );
}

export default Post