import { useRef, useState } from 'react';
import { Storage } from '@aws-amplify/storage';
import Uploady, {
  BatchItem,
  FILE_STATES,
} from '@rpldy/uploady';
import {
  SendOptions,
} from '@rpldy/shared';
import {
  SendMethod,
  SendResult,
  OnProgress,
} from '@rpldy/sender';
import UploadButton from "@rpldy/upload-button";

// type SendMethod = (item: BatchItem[], url: string | undefined, options: SendOptions, onProgress?: OnProgress) => SendResult;

const sendMethod = (
  item: BatchItem[],
  url: string | undefined,
  options: SendOptions,
  onProgress?: OnProgress,
): SendResult => {

  console.log('1:sendMethod', item);
  console.log('1:sendMethod', url);
  console.log('1:sendMethod', options);

  if (item.length) {
    console.log('2:sendMethod', item[0]);
    console.log('2:sendMethod', item[0].url);
    console.log('2:sendMethod', item[0].file);
  }

  const f = item[0].file;

  const request = Storage.put(
    `userimages/${f.name}`,
    f,
    {
      contentType: f.type,
      progressCallback(progress) {
        console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
      },
    }
  ).then(
    (result) => {
      return {
        status: 200,
        state: FILE_STATES.FINISHED,
        response: result,
      };
    }
  ).catch(
    (err) => {
      return {
        status: 0,
        state: FILE_STATES.ERROR,
        response: err,
      };
    }
  );

  const abort = () => {
    console.log('abort', request);
    Storage.cancel(request, "my message for cancellation");
    return true;
  };

  const senderType = "amplify-s3-sender";

  return {
    request,
    abort,
    senderType,
  };
}

export default function Home() {

  return (
    <Uploady
      method="PUT"
      destination={
        {
          url: "https://my-server",
          headers: {
            "x-custom": "123",
          },
        }
      }
      send={sendMethod}
    >
      <div className="App">
        <h2>S3 Upload example...</h2>
        <UploadButton />
      </div>
    </Uploady>
  );
};

/*
        <input
          type="file"
          accept="image/png, image/jpeg"
          style={{ display: "none" }}
          ref={upload}
          onChange={
            (e) => {
              setImageFile(upload.current!.files[0]);
              setImageName(upload.current!.files[0].name);
            }
          }
        />
        <input value={imageName} placeholder="Select file" />
        <button
          onClick={
            (e) => {
              // upload.current!.value = null;
              upload.current!.click();
            }}
        >
          Browse
        </button>

        <button onClick={uploadImage}> Upload File </button>

        {!!response && <div>{response}</div>}
*/
