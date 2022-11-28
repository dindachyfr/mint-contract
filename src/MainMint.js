import { useEffect, useState } from "react";
import { ethers, BigNumber } from "ethers";
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import DNFT from "./DNFT.json";
import axios from "axios";

const contractAddress = "0x06340aeb1daDffB3D63156fa74252aE297C91B97";

const MainMint = ({ accounts }) => {
  const [mintAmount, setMintAmount] = useState(1);
  const isConnected = Boolean(accounts);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, DNFT, signer);
      const statusContract = await contract.status();
      setStatus(statusContract);
    };

    fetchStatus().catch(console.error);
    // setTimeout(() => {
    //   alert(`${status} Period is active!`);    }, 300)
  }, []);

  async function handleMint() {
    if (window.ethereum && isConnected) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, DNFT, signer);
      try {
        let response;
        const statusContract = await contract.status();
        setStatus(statusContract);
        const price = await contract.getPrice();
        if (status === "PublicSale") {
          response = await contract.publicMint(BigNumber.from(mintAmount), {
            value: ethers.utils.parseEther(
              ((parseInt(Number(price)) / 10 ** 18) * mintAmount).toString()
            ),
          });
        }
        if (status === "PreSale") {
          const presale = await axios.get(
            `http://localhost:3000/whitelist/${accounts}`
          );
          console.log(presale);
          setTimeout(async () => {
            response = await contract.presaleMint(
              presale.data.proof,
              BigNumber.from(mintAmount),
              BigNumber.from(presale.data.allowance),
              {
                value: ethers.utils.parseEther(
                  ((parseInt(Number(price)) / 10 ** 18) * mintAmount).toString()
                ),
              }
            );
          }, 500);
        }
        if (status === "ReservedSale") {
          const reserved = await axios.get(
            `http://localhost:3000/reserved/${accounts}`
          );
          setTimeout(async () => {
            response = await contract.reservedMint(reserved.data.proof);
          }, 500);
        }
        console.log("response: ", response);
      } catch (err) {
        console.log("error: ", err);
        alert(err.message);
      } 
    }else{
      alert("Connect to your wallet first")
    }
  }

  const handleDecrement = () => {
    if (mintAmount <= 1 || status === "ReservedSale") return;
    setMintAmount(mintAmount - 1);
  };

  const handleIncrement = () => {
    if (mintAmount >= 3 || status === "ReservedSale") return;
    setMintAmount(mintAmount + 1);
  };

  return (
    <Flex justify="center" align="center" height="100vh" paddingBottom="150px">
      <Box width="520px">
        <VStack width="100%" justifyContent="center" alignItems="center">
          <Text fontSize="2xl">DNFT</Text>
          <Text fontSize="md">{status} Period is active!</Text>
        </VStack>
            <Box display="flex" justifyContent="center">
              <HStack align="center" justify="space-between" w="250px">
                <Text
                  fontSize="30px"
                  color="#4c6687"
                  border="solid 1px"
                  borderColor="#a8a6a6"
                  borderRadius="8px"
                  px="16px"
                  py="2px"
                  textAlign="center"
                  cursor="pointer"
                  onClick={handleDecrement}
                >
                  {" "}
                  -{" "}
                </Text>
                <Input
                  readOnly
                  fontFamily="inherit"
                  width="100px"
                  height="40px"
                  textAlign="center"
                  p="8px"
                  marginTop="10px"
                  type="number"
                  value={mintAmount}
                />
                <Text
                  fontSize="30px"
                  color="#4c6687"
                  border="solid 1px"
                  borderColor="#a8a6a6"
                  borderRadius="8px"
                  px="16px"
                  py="2px"
                  textAlign="center"
                  cursor="pointer"
                  onClick={handleIncrement}
                >
                  {" "}
                  +{" "}
                </Text>
              </HStack>
            </Box>
            <Box w="100%" display="flex" justifyContent="center">
              <Button
                onClick={handleMint}
                px="16px"
                py="8px"
                bgColor="#4c6687"
                color="#fff5de"
                cursor="pointer"
                borderRadius="4px"
              >
                Mint
              </Button>
            </Box>
      </Box>
    </Flex>
  );
};

export default MainMint;
