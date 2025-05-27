import { FileUploader, StorageImage } from "@aws-amplify/ui-react-storage";
import { list, remove } from "aws-amplify/storage";
import { useEffect, useState } from "react";

export default function App() {
	const prefix = "bf497525-36c5-4ddb-9a45-276701d5701d/";
	const [mode, setMode] = useState<"list" | "edit">("list");

	const images = useImages(prefix);
	const removeImage = (path: string) => {
		remove({
			path,
			options: {
				bucket: "my_images",
			},
		});
	};

	if (mode === "list") {
		return (
			<>
				<h1>一覧</h1>
				<button type="button" onClick={() => setMode("edit")}>
					編集へ
				</button>
				{images.map((image) => (
					<div key={image.path}>
						<StorageImage
							bucket="my_images"
							path={image.path}
							alt={image.path}
						/>
						<button type="button" onClick={() => removeImage(image.path)}>
							Delete
						</button>
					</div>
				))}
			</>
		);
	}
	return (
		<>
			<h1>編集画面</h1>
			<button type="button" onClick={() => setMode("list")}>
				一覧へ
			</button>
			<FileUploader
				bucket="my_images"
				acceptedFileTypes={["image/*"]}
				path={() => prefix}
				maxFileCount={5}
				// 撮影された写真を想定して妥当なサイズを設定する
				maxFileSize={1024 * 1024 * 10}
				defaultFiles={images.map((i) => ({ key: i.path }))}
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
				autoUpload={false}
			/>
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
