import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faKey, faImage, faCog, faCamera, faCogs, faHouse, faIndustry, faPerson, faStickyNote, faSave, faLightbulb, faVideo, faCheck, faXmark, faPencil, faLink, faMicrophone, faHashtag, faEnvelope, faUpload, faFileUpload, faXmarkCircle, faTrash, faArrowRight, faArrowLeft, faArrowUp, faArrowDown, faMagnifyingGlass, faTimes, faClipboard, faCheckCircle, faArrowsRotate, faQuestionCircle, faChevronDown, faChevronUp, faPlusCircle, faBars, faSignOut, faChevronRight, faSignIn, faUserPlus, faClipboardQuestion, faWineBottle, faArrowCircleRight, faComputer, faCircleUser, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { cn } from '@/lib/utils'
import Image from "next/image"
import * as whatsappLogo from '../../public/images/whatsapp-logo.png'

export const icons = Object.freeze({
    "User": faUser,
    "CircleUser": faCircleUser,
    "UserPlus": faUserPlus,
    "Camera": faCamera,
    "Save": faSave,
    "Copy": faClipboard,
    "ClipboardQuestion": faClipboardQuestion,
    "Cancel": faXmarkCircle,
    "Delete": faTrash,
    "Check": faCheck,
    "CheckCircle": faCheckCircle,
    "ChevronDown": faChevronDown,
    "ChevronUp": faChevronUp,
    "ChevronRight": faChevronRight,
    "Eye": faEye,
    "EyeSlash": faEyeSlash,
    "Key": faKey,
    "Image": faImage,
    "Industry": faIndustry,
    "Cog": faCog,
    "Cogs": faCogs,
    "House": faHouse,
    "StickyNote": faStickyNote,
    "Person": faPerson,
    "Lightbulb": faLightbulb,
    "Video": faVideo,
    "Audio": faMicrophone,
    "Pencil": faPencil,
    "Link": faLink,
    "Hashtag": faHashtag,
    "Envelope": faEnvelope,
    "Upload": faUpload,
    "FileUpload": faFileUpload,
    "ArrowRight": faArrowRight,
    "ArrowLeft": faArrowLeft,
    "ArrowUp": faArrowUp,
    "ArrowDown": faArrowDown,
    "ArrowsRotate": faArrowsRotate,
    "MagnifyingGlass": faMagnifyingGlass,
    "Times": faTimes,
    "Question": faQuestionCircle,
    "PlusCircle": faPlusCircle,
    "XMark": faXmark,
    "Bars": faBars,
    "SignOut": faSignOut,
    "SignIn": faSignIn,
    "WineBottle": faWineBottle
})

export const Icon = ({ icon, leftSide = false, className = "", ...props }) => {
    return (
        <div key={"icon"} className="flex flex-row gap-3 justify-center items-center">
            {leftSide && <FontAwesomeIcon icon={icons[icon]} {...props} />}
            {props.title && <span className={cn(className)}>{props.title}</span>}
            {!leftSide && <FontAwesomeIcon icon={icons[icon]} {...props} />}
        </div>
    )
}

export const trueFalseIndicator = (condition) => {
    return (
        <>
            {condition ?
                <Icon icon={"Check"} className="text-green-800" /> :
                <Icon icon={"XMark"} className="text-btn-red" />}
        </>
    )
}

export const WhatsappIcon = () => {
    return (
        <Image src={whatsappLogo} height={100} width={100}
            className="h-4 w-4 text-white" alt={"Logo Whatsapp"} />
    )
}