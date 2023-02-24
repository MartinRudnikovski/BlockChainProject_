// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract CVExplorer{

    event CVSaved(string message);
    event CVDeleted(string message);
    event AllCVsDeleted(string message);

    mapping( address => uint) public numberOfCVs;
    mapping( address => mapping( uint => CV)) public userCVs;


    struct CV {
        uint id;
        string name;
        string surname;
        uint age;
        string location;
        string contactInformation;
        string jobTitle;
        string experiences;
    }
    function saveCV(
        string memory name,
        string memory surname,
        uint age,
        string memory location,
        string memory contactInformation,
        string memory jobTitle,
        string memory experiences

    ) public {
        uint cvCount = numberOfCVs[msg.sender];
        userCVs[msg.sender][cvCount] = CV(cvCount, name, surname, age, location, contactInformation, jobTitle, experiences);
        emit CVSaved("Successfully saved your new CV.");
        numberOfCVs[msg.sender]++;
    }

    function deleteCV(uint id) public{
        delete userCVs[msg.sender][id];
        numberOfCVs[msg.sender] = numberOfCVs[msg.sender] - 1;

        emit CVDeleted("Deleted CV");
    }

    function deleteAllCVs() public {

        for (uint id=0; id<numberOfCVs[msg.sender]; id++){
            delete userCVs[msg.sender][id];
        }

        numberOfCVs[msg.sender] = 0;

        emit AllCVsDeleted("Deleted all CVs.");
    }
}