import { FileUploader, StorageImage } from "@aws-amplify/ui-react-storage";
import { list, remove } from "aws-amplify/storage";
import { useEffect, useState } from "react";

export default function App() {
	const prefix = "bf497525-36c5-4ddb-9a45-276701d5701d/";

	const images = useImages(prefix);
	const removeImage = (path: string) => {
		remove({
			path,
			options: {
				bucket: "my_images",
			},
		});
	};

	return (
		<>
			<FileUploader
				bucket="my_images"
				acceptedFileTypes={["image/*"]}
				path={() => prefix}
				maxFileCount={1}
				isResumable
				// onUploadStart={() => {
				// 	console.log("start");
				// }}
				// onUploadError={(error) => {
				// 	console.error(error);
				// }}
				// onUploadSuccess={() => {
				// 	console.log("success");
				// }}
				// autoUpload={false}
			/>
			<hr />
			{images.map((image) => (
				<div key={image.path}>
					<StorageImage bucket="my_images" path={image.path} alt={image.path} />
					<button type="button" onClick={() => removeImage(image.path)}>
						Delete
					</button>
				</div>
			))}
		</>
	);
}

function useImages(pathPrefix: string) {
	const [images, setImages] = useState([] as { path: string }[]);

	useEffect(() => {
		list({
			path: pathPrefix,
			options: {
				bucket: "my_images",
			},
		}).then((result) => {
			setImages(result.items);
		});
	}, [pathPrefix]);

	return images;
}
