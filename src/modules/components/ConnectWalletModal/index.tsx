import React, { useState } from "react";
// import WalletConnect from "@walletconnect/client";
// import QRCodeModal from "@walletconnect/qrcode-modal";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useEthers } from '@usedapp/core';

interface ModalProps {
  wallet?: string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setWallet(wallet: string | undefined): void;
}

export function ConnectWalletModal({
  wallet,
  visible,
  setVisible,
  setWallet,
}: ModalProps) {
  const { activateBrowserWallet, deactivate } = useEthers();
  const [isWalletConnect, setIsWalletConnect] = useState(false);

  function handleModalOpen() {
    setVisible(!visible);
  }

  async function handleMetamaskConnect() {
    activateBrowserWallet();
    setVisible(false);
  }

  // const connector = new WalletConnect({
  //  bridge: "https://bridge.walletconnect.org",
  //  qrcodeModal: QRCodeModal,
  // });

  function handleWalletConnect() {
    console.log('Ok')
    //  connector.on("connect", (error, payload) => {
    //     if (error) {
    //       throw error;
    //     } const { accounts } = payload.params[0];

    //     setIsWalletConnect(true);

    //     if (accounts[0]) {
    //       setWallet(accounts[0]);
    //     }
    //   });

    //  connector.on("session_update", (error, payload) => {
    //   if (error) {
    //     throw error;
    //   }

    //   const { accounts } = payload.params[0];
    //    setIsWalletConnect(true);

    //     if (accounts[0]) {
    //       setWallet(accounts[0]);
    //     }
    //   });

    //   connector.on("disconnect", (error) => {
    //     if (error) {
    //       throw error;
    //     }
    //   });

    //   connector.createSession();

    //   setVisible(false);
  }

  // useEffect(() => {
  //    if (connector.connected) {
  //      const accounts = connector.accounts;
  //      setIsWalletConnect(true);
  //      //const chainId = connector.chainId;

  //     @ts-ignore
  //     if (accounts[0]) {
  //       setWallet(accounts[0]);
  //      }
  //    }
  //  }, []);

  return (
    <Modal isOpen={visible} onClose={handleModalOpen}>
      <ModalOverlay />
      <ModalContent bg={"#1a202c"}>
        <ModalHeader>Choose your preferred wallet</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Flex flexDir={"column"}>
            <Button 
            bg={"#0e1019"}
            _hover={{
              bg: "#11131a",
            }}
              m={"0.5rem"}
              onClick={() => {
                handleMetamaskConnect();
              }}
            >
              Metamask
            </Button>
            <Button 
            bg={"#0e1019"}
              m={"0.5rem"}
              _hover={{
                bg: "#11131a",
              }}
              onClick={() => {
                handleWalletConnect();
              }}
              disabled
            >
              Wallet Connect
            </Button>

            {wallet && (
              <Button
                m={"0.5rem"}
                bg={"#0e1019"}
                _hover={{
                  bg: "#11131a",
                }}
                onClick={() => {
                  if (isWalletConnect) {
                    setIsWalletConnect(false);
                    // connector.killSession();
                  } else {
                    deactivate();
                  }
                  setVisible(false);
                  setWallet(undefined);
                }}
              >
                Disconnect
              </Button>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
