import React, { useState } from "react";
import { Box, Button, Flex, Spacer } from "@chakra-ui/react";
import { ethers } from "ethers";

const Navbar = ({ accounts, setAccounts }) => {
  const [signer, setSigner] = useState([])
  // const isConnected = Boolean(accounts);

  async function connectAccount() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      let accounts = await provider.send("eth_requestAccounts", []);
      setSigner(accounts);
      provider.on('accountsChanged', function (accounts) {
        setSigner(accounts);
    });
    const signer = provider.getSigner();

    const address = await signer.getAddress();
    setAccounts(address)
    }
  }


  console.log({accounts, signer});

  return (
    <Flex justify="flex-end" algin="center" padding="30px">
      {/* Left side - Social Media Icons */}
      {/* <Flex justify="space-around" width="40$" padding="0 75px">
        <Link href="https://www.facebook.com">
          <Image src={Facebook} boxSize="42px" margin="0 15px" />
        </Link>
        <Link href="https://www.twitter.com">
          <Image src={Twitter} boxSize="42px" margin="0 15px" />
        </Link>
        <Link href="https://www.gmail.com">
          <Image src={Email} boxSize="42px" margin="0 15px" />
        </Link>
      </Flex> */}

      {/* Right side - Section and Connect */}
      <Flex justify="space-around" align="center" padding="30px">
        <Box margin="0 15px">About</Box>
        <Spacer />
        <Box margin="0 15px">Mint</Box>
        <Spacer />
        <Box margin="0 15px">Team</Box>
        <Spacer />

        {/* Connect */}
        {accounts ? (
          <Box margin="0 15px" fontSize="sm">
            {accounts}
          </Box>
        ) : (
          <Button
          onClick={connectAccount}
          px="16px"
          py="8px"
          bgColor="#4c6687"
          color="#fff5de"
          borderRadius="8px"
          cursor="pointer"
        >
          Connect to Wallet
        </Button>

        )}
      </Flex>
    </Flex>
  );
};

export default Navbar;
