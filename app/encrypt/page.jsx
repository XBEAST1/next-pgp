"use client";

import { React, useState, useEffect, useRef } from "react";
import {
  Textarea,
  Checkbox,
  Input,
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalContent,
  Snippet,
} from "@heroui/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as openpgp from "openpgp";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const EyeSlashFilledIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M21.2714 9.17834C20.9814 8.71834 20.6714 8.28834 20.3514 7.88834C19.9814 7.41834 19.2814 7.37834 18.8614 7.79834L15.8614 10.7983C16.0814 11.4583 16.1214 12.2183 15.9214 13.0083C15.5714 14.4183 14.4314 15.5583 13.0214 15.9083C12.2314 16.1083 11.4714 16.0683 10.8114 15.8483C10.8114 15.8483 9.38141 17.2783 8.35141 18.3083C7.85141 18.8083 8.01141 19.6883 8.68141 19.9483C9.75141 20.3583 10.8614 20.5683 12.0014 20.5683C13.7814 20.5683 15.5114 20.0483 17.0914 19.0783C18.7014 18.0783 20.1514 16.6083 21.3214 14.7383C22.2714 13.2283 22.2214 10.6883 21.2714 9.17834Z"
        fill="currentColor"
      />
      <path
        d="M14.0206 9.98062L9.98062 14.0206C9.47062 13.5006 9.14062 12.7806 9.14062 12.0006C9.14062 10.4306 10.4206 9.14062 12.0006 9.14062C12.7806 9.14062 13.5006 9.47062 14.0206 9.98062Z"
        fill="currentColor"
      />
      <path
        d="M18.25 5.74969L14.86 9.13969C14.13 8.39969 13.12 7.95969 12 7.95969C9.76 7.95969 7.96 9.76969 7.96 11.9997C7.96 13.1197 8.41 14.1297 9.14 14.8597L5.76 18.2497H5.75C4.64 17.3497 3.62 16.1997 2.75 14.8397C1.75 13.2697 1.75 10.7197 2.75 9.14969C3.91 7.32969 5.33 5.89969 6.91 4.91969C8.49 3.95969 10.22 3.42969 12 3.42969C14.23 3.42969 16.39 4.24969 18.25 5.74969Z"
        fill="currentColor"
      />
      <path
        d="M14.8581 11.9981C14.8581 13.5681 13.5781 14.8581 11.9981 14.8581C11.9381 14.8581 11.8881 14.8581 11.8281 14.8381L14.8381 11.8281C14.8581 11.8881 14.8581 11.9381 14.8581 11.9981Z"
        fill="currentColor"
      />
      <path
        d="M21.7689 2.22891C21.4689 1.92891 20.9789 1.92891 20.6789 2.22891L2.22891 20.6889C1.92891 20.9889 1.92891 21.4789 2.22891 21.7789C2.37891 21.9189 2.56891 21.9989 2.76891 21.9989C2.96891 21.9989 3.15891 21.9189 3.30891 21.7689L21.7689 3.30891C22.0789 3.00891 22.0789 2.52891 21.7689 2.22891Z"
        fill="currentColor"
      />
    </svg>
  );
};

const EyeFilledIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M21.25 9.14969C18.94 5.51969 15.56 3.42969 12 3.42969C10.22 3.42969 8.49 3.94969 6.91 4.91969C5.33 5.89969 3.91 7.32969 2.75 9.14969C1.75 10.7197 1.75 13.2697 2.75 14.8397C5.06 18.4797 8.44 20.5597 12 20.5597C13.78 20.5597 15.51 20.0397 17.09 19.0697C18.67 18.0897 20.09 16.6597 21.25 14.8397C22.25 13.2797 22.25 10.7197 21.25 9.14969ZM12 16.0397C9.76 16.0397 7.96 14.2297 7.96 11.9997C7.96 9.76969 9.76 7.95969 12 7.95969C14.24 7.95969 16.04 9.76969 16.04 11.9997C16.04 14.2297 14.24 16.0397 12 16.0397Z"
        fill="currentColor"
      />
      <path
        d="M11.9984 9.14062C10.4284 9.14062 9.14844 10.4206 9.14844 12.0006C9.14844 13.5706 10.4284 14.8506 11.9984 14.8506C13.5684 14.8506 14.8584 13.5706 14.8584 12.0006C14.8584 10.4306 13.5684 9.14062 11.9984 9.14062Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default function App() {
  const [pgpKeys, setPgpKeys] = useState([]);
  const [signerKeys, setSignerKeys] = useState([]);
  const [signerKey, setSignerKey] = useState(null);
  const [recipientKeys, setRecipientKeys] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [recipients, setRecipients] = useState([""]);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [output, setOutput] = useState("");
  const [modalpassword, setModalpassword] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const onSubmitPassword = useRef(null);
  const [files, setFiles] = useState(null);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const dbName = "NextPGP";
  const dbPgpKeys = "pgpKeys";
  const selectedSigners = "selectedSigners";
  const selectedRecipients = "selectedRecipients";
  const dbCryptoKeys = "cryptoKeys";

  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(dbPgpKeys)) {
          db.createObjectStore(dbPgpKeys, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(selectedSigners)) {
          db.createObjectStore(selectedSigners, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(selectedRecipients)) {
          db.createObjectStore(selectedRecipients, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(dbCryptoKeys)) {
          db.createObjectStore(dbCryptoKeys, { keyPath: "id" });
        }
      };
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  };

  // Retrieves (or generates) the master encryption key using the Web Crypto API.
  const getEncryptionKey = async () => {
    const db = await openDB();
    const tx = db.transaction(dbCryptoKeys, "readonly");
    const store = tx.objectStore(dbCryptoKeys);
    const request = store.get("mainKey");

    return new Promise(async (resolve, reject) => {
      request.onsuccess = async () => {
        if (request.result) {
          const importedKey = await crypto.subtle.importKey(
            "raw",
            request.result.key,
            { name: "AES-GCM" },
            true,
            ["encrypt", "decrypt"]
          );
          resolve(importedKey);
        } else {
          // Generate a new key if not found
          const key = await crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
          );
          const exportedKey = await crypto.subtle.exportKey("raw", key);
          const txWrite = db.transaction(dbCryptoKeys, "readwrite");
          const storeWrite = txWrite.objectStore(dbCryptoKeys);
          storeWrite.put({ id: "mainKey", key: new Uint8Array(exportedKey) });
          resolve(key);
        }
      };
      request.onerror = (e) => reject(e.target.error);
    });
  };

  // Decrypts data using the provided encryption key and IV.
  const decryptData = async (encryptedData, key, iv) => {
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encryptedData
    );
    return JSON.parse(new TextDecoder().decode(decrypted));
  };

  // Retrieves all stored keys from IndexedDB and decrypts them.
  const getStoredKeys = async () => {
    const db = await openDB();
    const encryptionKey = await getEncryptionKey();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(dbPgpKeys, "readonly");
      const store = transaction.objectStore(dbPgpKeys);
      const records = [];
      const request = store.openCursor();

      request.onsuccess = async (event) => {
        const cursor = event.target.result;
        if (cursor) {
          records.push(cursor.value);
          cursor.continue();
        } else {
          try {
            const decryptedKeys = await Promise.all(
              records.map(async (record) => {
                const decrypted = await decryptData(
                  record.encrypted,
                  encryptionKey,
                  record.iv
                );
                return decrypted;
              })
            );
            resolve(decryptedKeys);
          } catch (error) {
            reject(error);
          }
        }
      };

      request.onerror = (e) => reject(e.target.error);
    });
  };

  useEffect(() => {
    const fetchKeysFromIndexedDB = async () => {
      try {
        const keysFromStorage = await getStoredKeys();

        const filteredSignerKeys = keysFromStorage.filter(
          (key) => key.publicKey && key.privateKey
        );
        const filteredRecipientKeys = keysFromStorage.filter(
          (key) => key.publicKey
        );

        setPgpKeys(keysFromStorage);
        setSignerKeys(filteredSignerKeys);
        setRecipientKeys(filteredRecipientKeys);
      } catch (error) {
        console.error("Error fetching keys:", error);
      }
    };

    fetchKeysFromIndexedDB();
  }, []);

  useEffect(() => {
    const fetchSelectedKeys = async () => {
      const db = await openDB();
      const transaction = db.transaction(
        [selectedRecipients, selectedSigners],
        "readwrite"
      );
      const storeSigners = transaction.objectStore(selectedSigners);
      const storeRecipients = transaction.objectStore(selectedRecipients);

      const signerKeyRequest = storeSigners.get("selectedSignerKey");
      const recipientsRequest = storeRecipients.get("selectedRecipients");

      signerKeyRequest.onsuccess = () => {
        if (signerKeyRequest.result) {
          setSignerKey(signerKeyRequest.result.value);
        }
      };

      recipientsRequest.onsuccess = () => {
        if (recipientsRequest.result) {
          setRecipients(recipientsRequest.result.value || [""]);
        }
      };
    };

    fetchSelectedKeys();
  }, []);

  const handleSignerSelection = async (selectedKey) => {
    const db = await openDB();
    const transaction = db.transaction(
      [dbPgpKeys, selectedSigners],
      "readwrite"
    );
    const store = transaction.objectStore(selectedSigners);

    store.put({ id: "selectedSignerKey", value: selectedKey });

    transaction.oncomplete = () => {
      setSignerKey(selectedKey);
    };
  };

  const handleSelection = async (index, selectedKey) => {
    const updatedRecipients = [...recipients];

    if (selectedKey) {
      updatedRecipients[index] = selectedKey;
      if (updatedRecipients[updatedRecipients.length - 1] !== "") {
        updatedRecipients.push("");
      }
    } else {
      updatedRecipients[index] = "";
      while (
        updatedRecipients.length > 1 &&
        updatedRecipients[updatedRecipients.length - 2] === "" &&
        updatedRecipients[updatedRecipients.length - 1] === ""
      ) {
        updatedRecipients.pop();
      }
    }

    setRecipients(updatedRecipients);

    const db = await openDB();
    const transaction = db.transaction(
      [dbPgpKeys, selectedRecipients],
      "readwrite"
    );
    const store = transaction.objectStore(selectedRecipients);

    store.put({ id: "selectedRecipients", value: updatedRecipients });
  };

  const encryptMessage = async () => {
    try {
      // If the message is empty then don't push anything to output
      if (!message.trim()) {
        return;
      }
      const recipientKeysPublic = recipientKeys
        .filter((key) => recipients.includes(key.id.toString()))
        .map((key) => key.publicKey);

      // Find the selected signer
      const signer = signerKeys.find((key) => key.id.toString() === signerKey);

      if (!isChecked && recipientKeysPublic.length === 0) {
        toast.error(
          "Please select at least one recipient or provide a password",
          {
            position: "top-right",
          }
        );
        return;
      }

      let privateKey = null;
      if (signer) {
        const privateKeyObject = await openpgp.readPrivateKey({
          armoredKey: signer.privateKey,
        });

        // Check if the private key is encrypted
        if (!privateKeyObject.isDecrypted()) {
          setIsPasswordModalOpen(true);

          // Wait for the passphrase from the modal
          const passphrase = await new Promise((resolve) => {
            onSubmitPassword.current = resolve;
          });

          // Decrypt the private key
          privateKey = await openpgp.decryptKey({
            privateKey: privateKeyObject,
            passphrase: passphrase,
          });

          if (!privateKey || !privateKey.isDecrypted()) {
            throw new Error("Failed to decrypt the private key");
          }
        } else {
          privateKey = privateKeyObject;
        }
      }

      const messageToEncrypt = await openpgp.createMessage({ text: message });

      const encryptionOptions = {
        message: messageToEncrypt,
        ...(isChecked && password && { passwords: [password] }),
        ...(recipientKeysPublic.length > 0 && {
          encryptionKeys: await Promise.all(
            recipientKeysPublic.map((key) =>
              openpgp.readKey({ armoredKey: key })
            )
          ),
        }),
        ...(privateKey && { signingKeys: privateKey }),
      };

      // Encrypt the message
      const encryptedMessage = await openpgp.encrypt(encryptionOptions);
      setOutput(encryptedMessage);
    } catch (error) {
      toast.error("Please Enter a Password", {
        position: "top-right",
      });
    }
  };

  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const encryptFiles = async () => {
    if (!files || files.length === 0) {
      return;
    }

    try {
      let fileToEncrypt;

      // Check if it's a single file or multiple files
      if (files.length === 1) {
        const fileData = await files[0].arrayBuffer();
        fileToEncrypt = new Uint8Array(fileData);
      } else {
        const zip = new JSZip();

        for (const file of files) {
          const fileData = await file.arrayBuffer();
          zip.file(file.name, fileData);
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const zipArrayBuffer = await zipBlob.arrayBuffer();
        fileToEncrypt = new Uint8Array(zipArrayBuffer);
      }

      // Find the recipient keys (public keys of the selected recipients)
      const recipientKeysPublic = recipientKeys
        .filter((key) => recipients.includes(key.id.toString()))
        .map((key) => key.publicKey);

      // Validation for empty recipients and password
      if (recipientKeysPublic.length === 0 && !password) {
        toast.error(
          "Please select at least one recipient or provide a password"
        );
        return;
      }

      let encryptionOptions = {
        message: await openpgp.createMessage({ binary: fileToEncrypt }),
      };

      // If recipients are selected, encrypt with public keys
      if (recipientKeysPublic.length > 0) {
        encryptionOptions.encryptionKeys = await Promise.all(
          recipientKeysPublic.map((key) => openpgp.readKey({ armoredKey: key }))
        );
      }

      // If no recipients are selected but a password is provided, encrypt with the password
      if (recipientKeysPublic.length === 0 && password) {
        encryptionOptions.passwords = [password];
      }

      // If both recipients and password are selected, include both in encryption
      if (recipientKeysPublic.length > 0 && password) {
        encryptionOptions.passwords = [password];
      }

      // Find the selected signer and decrypt their private key if needed
      let privateKey = null;
      const signer = signerKeys.find((key) => key.id.toString() === signerKey);

      if (signer) {
        const privateKeyObject = await openpgp.readPrivateKey({
          armoredKey: signer.privateKey,
        });

        if (!privateKeyObject.isDecrypted()) {
          setIsPasswordModalOpen(true);

          const passphrase = await new Promise((resolve) => {
            onSubmitPassword.current = resolve;
          });

          // Decrypt the private key
          privateKey = await openpgp.decryptKey({
            privateKey: privateKeyObject,
            passphrase: passphrase,
          });

          if (!privateKey || !privateKey.isDecrypted()) {
            throw new Error("Failed to decrypt the private key");
          }
        } else {
          privateKey = privateKeyObject;
        }

        if (privateKey) {
          encryptionOptions.signingKeys = privateKey;
        }
      }

      const encrypted = await openpgp.encrypt({
        ...encryptionOptions,
        format: "binary",
      });

      // Convert encrypted content to Blob and download
      const encryptedBlob = new Blob([encrypted], {
        type: "application/octet-stream",
      });
      const fileName = files.length === 1 ? files[0].name : "archive.zip";
      saveAs(encryptedBlob, `${fileName}.gpg`);
    } catch (error) {
      toast.error("Password Incorrect");
    }
  };

  const handleEncrypt = async () => {
    if (message || files) {
      await encryptMessage();
      await encryptFiles();
    } else {
      toast.error("Please Enter a Message or Select a File", {
        position: "top-right",
      });
    }
  };

  return (
    <>
      <ToastContainer theme="dark" />
      <h1 className="text-center text-4xl dm-serif-text-regular">
        Encrypt Message
      </h1>
      <br />
      <br />
      <div className="flex flex-row gap-0 flex-wrap md:gap-4">
        <div className="flex-1 mb-4 md:mb-0">
          <Textarea
            disableAutosize
            classNames={{
              input: "resize-y xs:min-w-[350px] min-w-[0px]",
            }}
            style={{
              minHeight: `${235 + recipients.length * 70}px`,
            }}
            label="Encrypt"
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <br />
        <div className="w-full md:w-[350px]">
          <div className="flex flex-col gap-4">
            <h5 className="ms-1">Sign as:</h5>
            <Autocomplete
              className="max-w-full"
              label="Select the signer"
              allowsCustomValue={false}
              selectedKey={signerKey}
              defaultItems={signerKeys}
              onSelectionChange={handleSignerSelection}
            >
              {(item) => (
                <AutocompleteItem
                  key={item.id}
                  textValue={`${item.name} (${item.email})`}
                >
                  {item.name} ({item.email})
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>
          <div className="flex flex-col gap-4">
            <h5 className="mt-4 ms-1">Encrypt for:</h5>
            {recipients.map((selectedKey, index) => (
              <Autocomplete
                key={index}
                className="max-w-full"
                label={`Select recipient ${index + 1}`}
                selectedKey={selectedKey}
                onSelectionChange={(key) => handleSelection(index, key)}
                defaultItems={recipientKeys.filter(
                  (key) =>
                    !recipients.includes(String(key.id)) ||
                    String(key.id) === selectedKey
                )}
              >
                {(item) => (
                  <AutocompleteItem
                    key={item.id}
                    textValue={`${item.name} (${item.email})`}
                  >
                    {item.name} ({item.email})
                  </AutocompleteItem>
                )}
              </Autocomplete>
            ))}
          </div>
          <br />
          <Checkbox
            defaultSelected={isChecked}
            color="default"
            onChange={(e) => setIsChecked(e.target.checked)}
          >
            <span className="text-medium">Encrypt With Password.</span>
            <p className="text-sm">
              Anyone you share the password with can read it.
            </p>
          </Checkbox>
          <br />
          <br />
          <Input
            isDisabled={!isChecked}
            classNames={{
              input: "min-h-[10px]",
            }}
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
          />
        </div>
      </div>
      <br />
      <Input type="file" multiple onChange={handleFileUpload} />
      <br />
      <h5 className="ms-1">Encrypted PGP Message:</h5>
      <br />
      <Snippet
        symbol=""
        classNames={{
          base: "max-w-full p-5 overflow-auto",
          content: "whitespace-pre-wrap break-all",
          pre: "whitespace-pre-wrap break-all max-h-[300px] overflow-auto",
        }}
      >
        {output}
      </Snippet>
      <br />
      <br />
      <Button onPress={handleEncrypt}>Encrypt</Button>
      <Modal
        backdrop="blur"
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      >
        <ModalContent className="p-5">
          <h3 className="mb-4">Signing Key Password Protected</h3>
          <Input
            placeholder="Enter Password"
            type={isVisible ? "text" : "password"}
            value={modalpassword}
            onChange={(e) => setModalpassword(e.target.value)}
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // Simulate the button click on Enter key press
                if (modalpassword) {
                  setIsPasswordModalOpen(false);
                  if (onSubmitPassword.current) {
                    onSubmitPassword.current(modalpassword);
                  }
                } else {
                  toast.error("Please enter a password");
                }
              }
            }}
          />
          <br />
          <Button
            onPress={() => {
              if (modalpassword) {
                setIsPasswordModalOpen(false);
                if (onSubmitPassword.current) {
                  onSubmitPassword.current(modalpassword);
                }
              } else {
                toast.error("Please enter a password");
              }
            }}
          >
            Submit
          </Button>
        </ModalContent>
      </Modal>
    </>
  );
}
