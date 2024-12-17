import { StadiumImage } from "../../types/playground.types"


interface StadiumImageProps {
    stadiumImages: StadiumImage[];
}

const DisplayImages:React.FC<StadiumImageProps> = ({stadiumImages})=>{
    return (
        <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Images:</h2>
        <div className="flex flex-wrap">
            {stadiumImages.map((image: StadiumImage) => (
                <img
                    key={image.stadiumImageId}
                    src={`https://hawihub-001-site1.dtempurl.com/${image.stadiumImageUrl}`}
                    alt={`Image ${image.stadiumImageId}`}
                    className="rounded-lg mb-2 mr-2 max-w-32"
                />
            ))}
        </div>
    </div>
    )
}

export default DisplayImages;