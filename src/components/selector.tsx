import React, { FunctionComponent } from "react";
import { useZakeke } from "zakeke-configurator-react";
import { useState, useRef } from "react";
import { useEffect } from "react";
import { List, ListItem, ListItemImage } from "./list";
import styled from "styled-components";
import { SquareLoader, MoonLoader } from "react-spinners";
import Circles from "./circles";
import axios from "axios";
import { addEmail } from "./addtoEmailList";
import QRCodeComponent from "./QrCodeComponent";

const Container = styled.div`
  height: 100%;
  overflow: auto;
`;

interface currentSelectionObj {
  attributeId: number;
  attributeName: string;
  optionName: string | undefined;
  show: boolean;
}

const Selector: FunctionComponent<{}> = () => {
  const {
    isSceneLoading,
    product,
    productName,
    isAddToCartLoading,
    price,
    groups,
    selectOption,
    addToCart,
    templates,
    setTemplate,
    getMeshIDbyName,
    hideMeshAndSaveState,
    restoreMeshVisibility,
    setCamera,
    getPDF,
    setCameraByName,
    getQrCodeArUrl,
    getMobileArUrl,
  } = useZakeke();

  const [currentSelection, setCurrentSelection] = useState<
    currentSelectionObj[]
  >([]);
  const closeRef = useRef<HTMLAnchorElement>(null);

  const ulRef = useRef<HTMLDivElement>(null);
  const actualUlRef = useRef<HTMLUListElement>(null);

  const [qrUrl, setQrUrl] = useState<string | Blob>("");

  // Keep saved the ID and not the refereces, they will change on each update
  const [selectedGroupId, selectGroup] = useState<number | null>(null);
  const [prevSelectedGroupId, setPrevSelectedGroupId] = useState<number | null>(
    null
  );
  const [selectedStepId, selectStep] = useState<number | null>(null);
  const [selectedAttributeId, selectAttribute] = useState<number | null>(null);

  const selectedGroup = groups.find((group) => group.id === selectedGroupId);
  const selectedStep = selectedGroup
    ? selectedGroup.steps.find((step) => step.id === selectedStepId)
    : null;

  // Attributes can be in both groups and steps, so show the attributes of step or in a group based on selection
  const attributes = (selectedStep || selectedGroup)?.attributes ?? [];
  const selectedAttribute = attributes.find(
    (attribute) => attribute.id === selectedAttributeId
  );

  const [occhiali1Id, setOcchiali1Id] = useState<string | null>(null);
  const [occhiali2Id, setOcchiali2Id] = useState<string | null>(null);
  const [astuccioId, setAstuccioId] = useState<string | null>(null);

  // State for currentOption circle indicators on mobile
  const [currentOption, setCurrentOption] = useState(1);

  // True for when undermount basin has been selected
  const [isUndermountBasin, setIsUndermountBasin] = useState(false);
  const [isDoubleAlphaBasin, setIsDoubleAlphaBasin] = useState(false);
  const [isSingleAlphaBasin, setIsSingleAlphaBasin] = useState(false);
  const [fullCountertopBasin, setFullCountertopBasin] = useState(false);

  // To set add to cart but disabled if all options are not chosen
  const [disableCartBtn, setDisableCartBtn] = useState(true);
  const [requiredArr, setRequiredArr] = useState([
    "Cabinet Colour",
    "Basins",
    "Benchtop",
    "Handles",
    "Tapholes",
  ]);
  const [requiredAttributesToRemove, setRequiredAttributesToRemove] = useState([
    "",
  ]);

  const [showingEmail, setShowingEmail] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [email, setEmail] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  // Open the first group and the first step when loaded
  useEffect(() => {
    if (!selectedGroup && groups.length > 0) {
      selectGroup(groups[0].id);

      if (groups[0].steps.length > 0) selectStep(groups[0].steps[0].id);

      if (templates.length > 0) setTemplate(templates[0].id);
    }
  }, [selectedGroup, groups]);

  // Select attribute first time
  useEffect(() => {
    if (!selectedAttribute && attributes.length > 0)
      selectAttribute(attributes[0].id);
  }, [selectedAttribute, attributes]);

  useEffect(() => {
    if (isSceneLoading === false && groups.length > 0) {
      const occhiali1 = getMeshIDbyName("MODELLO_B");
      const occhiali2 = getMeshIDbyName("NAU_ALL");
      const astuccio = getMeshIDbyName("astucchio");

      setOcchiali1Id(occhiali1 ?? "");
      setOcchiali2Id(occhiali2 ?? "");
      setAstuccioId(astuccio ?? "");
    }

    window.dispatchEvent(new Event("resize"));
    //setCameraByName('starting point', false, true);
  }, [isSceneLoading]);

  useEffect(() => {
    if (!isSceneLoading && groups.length > 0) {
      const astuccioGroup = groups.find((group) => group.name === "ASTUCCIO");

      if (astuccioGroup && selectedGroupId == astuccioGroup.id) {
        restoreMeshVisibility(astuccioId!);

        setTimeout(() => {
          hideMeshAndSaveState(occhiali1Id!);
          hideMeshAndSaveState(occhiali2Id!);
        }, 2000);
      } else if (astuccioGroup && prevSelectedGroupId == astuccioGroup.id) {
        restoreMeshVisibility(occhiali1Id!);
        restoreMeshVisibility(occhiali2Id!);

        setTimeout(() => {
          hideMeshAndSaveState(astuccioId!);
        }, 2000);
      }

      //console.log({ second: astuccioGroup, selectedGroupId });
    }
  }, [selectedGroupId, isSceneLoading]);

  useEffect(() => {
    if (selectedGroup) {
      const camera = selectedGroup.cameraLocationId;
      if (camera) setCamera(camera);
    }
  }, [selectedGroupId]);

  // Enabling 'Add To Cart' button
  useEffect(() => {
    let correctAttributes = [
      "Cabinet Colour",
      "Basins",
      "Benchtop",
      "Handles",
      "Tapholes",
    ];
    correctAttributes = attributes
      .filter((attribute) => attribute.name !== "Accessories")
      .map((attribute) => attribute.name);
    correctAttributes = correctAttributes.filter(
      (value) => !requiredAttributesToRemove.includes(value)
    );

    let isEqual = false;
    if (currentSelection.length > 0) {
      isEqual = correctAttributes.every((value) => {
        return currentSelection.some((obj) => obj.attributeName === value);
      });
    }
    //console.log(currentSelection.length);
    //console.log(isEqual)
    if (isEqual) {
      setDisableCartBtn(false);
    } else {
      setDisableCartBtn(true);
    }
  }, [requiredAttributesToRemove, currentSelection]);

  if (isSceneLoading || !groups || groups.length === 0) {
    return (
      <div className="loading__container">
        <SquareLoader color="#002240" />
        <span className="loading__text">Loading your Vanity Builder</span>
        <br />
        <span>This may take a few moments...</span>
      </div>
    );
  }
  // groups
  // -- attributes
  // -- -- options
  // -- steps
  // -- -- attributes
  // -- -- -- options

  function handleMouseEnter(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    const title = event.currentTarget.querySelector(
      ".optionText"
    ) as HTMLElement;
    if (title) {
      title.style.opacity = "1";
    }
  }

  function handleMouseLeave(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    const title = event.currentTarget.querySelector(
      ".optionText"
    ) as HTMLElement;
    if (title) {
      title.style.opacity = "0";
    }
  }

  function handleNewSelection(selection: any) {
    console.log("SELECTING : " + selection.name);
    let newObject: currentSelectionObj = {
      attributeId: 0,
      attributeName: "selectedAttribute",
      optionName: selection.name,
      show: true,
    };

    if (selectedAttribute) {
      newObject = {
        attributeId: selectedAttribute.id,
        attributeName: selectedAttribute.name,
        optionName: selection.name,
        show: true,
      };
    }

    let updatedArray = currentSelection.map((obj) => {
      if (obj.attributeId === newObject.attributeId) {
        return newObject;
      } else {
        return obj;
      }
    });

    const attributeButtonObj = document.getElementById(
      newObject.attributeId.toString()
    );

    if (
      !updatedArray.some((obj) => obj.attributeId === newObject.attributeId)
    ) {
      updatedArray.push(newObject);

      if (attributeButtonObj) {
        attributeButtonObj.classList.add("show-after");
      }
    }

    
    // Change selected choices for undercounter vanity changes.
    if (selectedAttribute?.name === "Basins") {
      // Check if we are using Undercounter Basins
      if (selection.name.split(' ')[0] === "Undercounter") {
        //  Return previous basin, benchtop & taphole choice
        const prevBasinChoice = currentSelection.find(
          (obj) => obj.attributeName === "Basins"
        );
        const prevBenchtopChoice = currentSelection.find(
          (obj) => obj.attributeName === "Benchtop"
        );
        const prevTapChoice = currentSelection.find(
          (obj) => obj.attributeName === "Tapholes"
        );

        // Update 'Benchtop' in selection array correctly
        // If there is a bench chosen already and we are changing the basin
        if (prevBenchtopChoice && selection.name !== prevBasinChoice?.optionName) {
          // Check to see if it is just changing to a different Allure
          if (selection.name.split(' ')[1] === "Allure" && prevBasinChoice?.optionName?.split(' ')[1] === "Allure"){
            return;
          } else {
            //If changing to different basin the Benchtop will change to 'Arctic White' so update the selected array to show this
            updatedArray = updatedArray.map((obj) => {
              if (obj.attributeName === "Benchtop") {
                return { ...obj, optionName: "Silksurface Arctic White" };
              }
              return obj;
            });
          }
        }

        //Update 'Tapholes' in selection array correctly

        // If going from allure to rectangle basin (or vice versa), update to 'No Taphole'
        if ((prevBasinChoice?.optionName?.split(' ')[1] === "Allure" && selection.name === "Undercounter Rectangle") || 
        (prevBasinChoice?.optionName === "Undercounter Rectangle" && selection.name?.split(' ')[1] ===  "Allure")){
          updatedArray = updatedArray.map((obj) => {
            if (obj.attributeName === "Tapholes") {
              return { ...obj, optionName: "No Taphole" };
            }
            return obj;
          });
        }
        // If centre taphole selected and going from Oval to Allure update to 'No Taphole'
        if ((prevTapChoice?.optionName === "1 Taphole Centre") && (prevBasinChoice?.optionName === "Undercounter Oval" && selection.name?.split(' ')[1] ===  "Allure" )) {
          updatedArray = updatedArray.map((obj) => {
            if (obj.attributeName === "Tapholes") {
              return { ...obj, optionName: "No Taphole" };
            }
            return obj;
          });
        }
      }
    }
    /*
    if (
      selection.attribute.name === "Basins" &&
      selection.description === "Counter"
    ) {
      // Remove ticks from Taphole and Benchtop options
      const benchtopObj = updatedArray.find(
        (attribute) => attribute.attributeName === "Benchtop"
      );
      if (benchtopObj) {
        const benchtopBtn = document.getElementById(
          benchtopObj.attributeId.toString()
        );
        if (benchtopBtn) {
          benchtopBtn.classList.remove("show-after");
        }
      }

      const tapholeObj = updatedArray.find(
        (attribute) => attribute.attributeName === "Tapholes"
      );
      if (tapholeObj) {
        const tapholeBtn = document.getElementById(
          tapholeObj.attributeId.toString()
        );
        if (tapholeBtn) {
          tapholeBtn.classList.remove("show-after");
        }
      }

      // Remove Taphole and Benchtop from current selection display
      const attributesToRemove = ["Benchtop", "Tapholes"];
      //const filteredArray = updatedArray.filter(attribute => !attributesToRemove.includes(attribute.attributeName));
      const newArray = updatedArray.map((attribute) => {
        if (attributesToRemove.includes(attribute.attributeName)) {
          return { ...attribute, show: false };
        } else {
          return attribute;
        }
      });
      updatedArray = newArray;
    } else {
      // Un-hide all selected options
      const newArray = updatedArray.map((attribute) => {
        return { ...attribute, show: true };
      });
      updatedArray = newArray;
      // Re-add the ticks on the boxes if they exist in the newest array
      updatedArray.forEach((attribute) => {
        const btn = document.getElementById(attribute.attributeId.toString());
        if (btn) {
          if (!btn.classList.contains("show-after")) {
            btn.classList.add("show-after");
          }
        }
      });
    }
    */

    /*
     *     Handle selecting the same benchtop when swapping from over/under basins
     */
    if (selectedAttribute?.name === "Basins") {
      /*
      // Check if the basin selection is a full counter basin
      if (
        selection.description === "Counter" &&
        selection.attribute.name === "Basins"
      ) {
        setFullCountertopBasin(true);
        setRequiredAttributesToRemove(["Benchtop", "Tapholes"]);
      } else {
        setFullCountertopBasin(false);
        setRequiredAttributesToRemove([""]);
        // Update benchtop to match chosen basin
        updateSelectedBenchtop(selection.description);
        // Return all benchtops
        const benchtopAttributeObj = groups[0].attributes.find(
          (item) => item.name === "Benchtop"
        );
        const firstEnabledBenchtop = benchtopAttributeObj?.options.find(
          (obj) => obj.enabled
        );
        const updatedSelection = updatedArray.map((selection) => {
          if (selection.attributeName === "Benchtop") {
            return {
              ...selection,
              optionName: firstEnabledBenchtop?.name,
            };
          }
          return selection;
        });
        updatedArray = updatedSelection;
      }
      // Then select the chosen basin
      selectOption(selection.id);
      */
    }
    setCurrentSelection(updatedArray);
  }

  const updateSelectedBenchtop = (type: string) => {
    const currentBenchtopSelection = currentSelection.find(
      (item) => item.attributeName === "Benchtop"
    );
    // Return all benchtops
    const benchtopAttributeObj = groups[0].attributes.find(
      (item) => item.name === "Benchtop"
    );

    const correctedBenchtop = benchtopAttributeObj?.options
      .filter((item) => item.name === currentBenchtopSelection?.optionName)
      .find((item) => item.description === type);

    if (!correctedBenchtop) {
      benchtopAttributeObj?.options
        .filter((item) => item.name === currentBenchtopSelection?.optionName)
        .find((item) => item.description === "Overmount");
    }

    // Set correct id for new benchtop
    if (correctedBenchtop) {
      selectOption(correctedBenchtop.id);
    } else {
      // If none found select first available one (for the selection list only)
      /*
      const firstEnabledBenchtop = benchtopAttributeObj?.options.find((obj) => obj.enabled);
      const updatedSelection = currentSelection.map(selection => {
        if (selection.attributeName === "Benchtop") {
          return {
            ...selection,
            optionName: firstEnabledBenchtop?.name
          };
        }
        return selection;
      });
      setCurrentSelection(updatedSelection);
      */
    }
  };

  let counter = 0;

  const prevBtnObj = document.getElementById("prevBtn");
  const nextBtnObj = document.getElementById("nextBtn");

  const downloadPdf = async (pdf: string) => {
    try {
      //console.log("Start downloadPDF");
      if (pdf !== '') {
        const response = await axios.get(pdf, { responseType: "blob" });
        const blob = response.data;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "My-Custom-Vanity.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toggleEmailPop();
        setLoadingPDF(false);
        //console.log("downloadPDF complete");
      } else {
        console.log("PDF url was blank");
      }
    } catch (error) {
      console.error("Error while downloading PDF:", error);
    }
  };

  const toggleEmailPop = async () => {
    const element = document.getElementsByClassName(
      "popup-close"
    )[0] as HTMLAnchorElement;
    element.click();

    setShowingEmail(!showingEmail);

    setIsChecked(true);
    // Start getURL
  };

  //const savePDFUrl = async () => {
  //  //await getPDF().then( pdf => {
  //  //  setPdfUrl(pdf);
  //  //});
  //  //console.log(pdfUrl);
  //};

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //console.log("handle submit form");
    event.preventDefault();
    setLoadingPDF(true);
    getPDF().then( pdf => {
      //console.log("URL: " + pdf);
      downloadPdf(pdf);
    });

    if (isChecked) {
      // Add the email to the klaviyo list
      addEmail(email);
    }
    //console.log("handleSubmit complete");
  };

  return (
    <Container>
      {/*
        <List>
            {groups.map(group => {
                return <ListItem key={group.id} onClick={() => {
                    setPrevSelectedGroupId(selectedGroupId);
                    selectGroup(group.id)
                }} selected={selectedGroup === group}>Group: {group.id === -1 ? 'Other' : group.name}</ListItem>;
            })}
        </List>
        */}
      <div className="selectContainer">
        <div className="stepContainer">
          {selectedGroup && selectedGroup.steps.length > 0 && (
            <List>
              {selectedGroup.steps.map((step) => {
                return (
                  <ListItem
                    key={step.id}
                    onClick={() => selectStep(step.id)}
                    selected={selectedStep === step}
                    available={true}
                  >
                    Step: {step.name}
                  </ListItem>
                );
              })}
            </List>
          )}

          <List ref={actualUlRef}>
            {attributes &&
              attributes.map((attribute, index) => {
                counter += 1;

                let attributeAvailable = true;
                let unavailableTitle = "";

                if (fullCountertopBasin) {
                  //if full countertop basin is selected then disable Tapholes and Benchtop options
                  if (
                    attribute.name === "Tapholes" ||
                    attribute.name === "Benchtop"
                  ) {
                    attributeAvailable = false;
                    unavailableTitle = "Invalid with current Basin";
                  }
                }
                return (
                  <ListItem
                    key={attribute.id}
                    onClick={() => {
                      if (attributeAvailable) {
                        if (ulRef.current) {
                          ulRef.current.scrollTop = 0;
                          ulRef.current.scrollLeft = 0;
                        }
                        if (actualUlRef.current) {
                          actualUlRef.current.scrollLeft = 0;
                        }
                        selectAttribute(attribute.id);

                        setCameraByName(attribute.name, false, true);
                      }
                      if (index !== attributes.length - 1) {
                        nextBtnObj?.classList.remove("hidden");
                      } else {
                        nextBtnObj?.classList.add("hidden");
                      }
                      if (index !== 0) {
                        prevBtnObj?.classList.remove("hidden");
                      } else {
                        prevBtnObj?.classList.add("hidden");
                      }
                    }}
                    selected={selectedAttribute === attribute}
                    className="attributeListItem"
                    available={attributeAvailable}
                    title={unavailableTitle}
                  >
                    <div className="listBadge" id={attribute.id.toString()}>
                      {counter}
                    </div>
                    {attribute.name}
                  </ListItem>
                );
              })}
          </List>
        </div>
        <div className="optionMain">
          <div className="selectHeader">
            <button
              id="prevBtn"
              className="selectHeader--prev hidden"
              onClick={() => {
                if (selectedAttribute) {
                  var currentIndex = attributes.indexOf(selectedAttribute);
                  if (nextBtnObj) {
                    nextBtnObj.classList.remove("hidden");
                  }

                  if (currentIndex === 0) {
                    // At first index so do nothing and button should be hidden
                  } else {
                    currentIndex = currentIndex - 1;
                    if (currentIndex === 0) {
                      if (prevBtnObj) {
                        prevBtnObj.classList.add("hidden");
                      }
                    }
                  }

                  if (
                    fullCountertopBasin &&
                    (attributes[currentIndex].name === "Benchtop" ||
                      attributes[currentIndex].name === "Tapholes")
                  ) {
                    currentIndex--;
                  }

                  selectAttribute(attributes[currentIndex].id);
                  setCurrentOption(currentIndex + 1);
                  setCameraByName(attributes[currentIndex].name, false, true);

                  if (ulRef.current) {
                    ulRef.current.scrollTop = 0;
                    ulRef.current.scrollLeft = 0;
                  }
                  if (actualUlRef.current) {
                    actualUlRef.current.scroll(0, 0);
                  }
                }
              }}
            >
              Prev
            </button>
            <div className="selectHeader--center">
              <h3 className="selectHeader--text">
                {selectedAttribute && selectedAttribute.name}
              </h3>
              <div className="selectHeader--circles">
                <Circles
                  currentOption={currentOption}
                  optionsCount={attributes.length}
                />
              </div>
            </div>
            <button
              id="nextBtn"
              className="selectHeader--next"
              onClick={() => {
                if (selectedAttribute) {
                  var currentIndex = attributes.indexOf(selectedAttribute);

                  if (prevBtnObj) {
                    prevBtnObj.classList.remove("hidden");
                  }

                  if (currentIndex !== attributes.length - 1) {
                    // Has reached the final attribute
                    currentIndex = currentIndex + 1;
                  }

                  if (currentIndex === attributes.length - 1) {
                    if (nextBtnObj) {
                      nextBtnObj.classList.add("hidden");
                    }
                  }
                  if (
                    fullCountertopBasin &&
                    (attributes[currentIndex].name === "Benchtop" ||
                      attributes[currentIndex].name === "Tapholes")
                  ) {
                    currentIndex++;
                  }
                  selectAttribute(attributes[currentIndex].id);
                  setCurrentOption(currentIndex + 1);
                  setCameraByName(attributes[currentIndex].name, false, true);

                  if (ulRef.current) {
                    ulRef.current.scrollLeft = 0;
                    ulRef.current.scrollTop = 0;
                  }

                  if (actualUlRef.current) {
                    actualUlRef.current.scroll(0, 0);
                  }
                }
              }}
            >
              Next
            </button>
          </div>
          <div className="optionContainer" ref={ulRef}>
            {isUndermountBasin &&
              (selectedAttribute?.name === "Benchtop" ||
                selectedAttribute?.name === "Tapholes") && (
                <p className="options-unavailabletext">
                  * Some options are unavailable with undermount basins
                </p>
              )}
            {(isSingleAlphaBasin || isDoubleAlphaBasin) &&
              selectedAttribute?.name === "Benchtop" && (
                <div className="alphaBasin-overlay">
                  <div className="alphaBasin-overlay--content">
                    <h4>Benchtop option not compatible with Alpha Basin</h4>
                    <h6>
                      To select a different benchtop, please choose a basin that
                      is compatible with your preferred benchtop option.
                    </h6>
                  </div>
                </div>
              )}
            <List>
              {selectedAttribute &&
                selectedAttribute.options.map((option) => {
                  let itemAvailable = true;
                  let unavailableTitle = "";
                  //console.log(option);

                  /*
                  if (!option.enabled && option.attribute.name === "Benchtop") {
                    itemAvailable = false;
                    unavailableTitle = "Incompatible basin selected";
                  }
                  if (!option.enabled && option.attribute.name === "Tapholes") {
                    return;
                  }
                  if (
                    !option.enabled &&
                    option.name.split(" ")[0] === "SilkSurface"
                  ) {
                    return;
                  }
                  */
                  if (!option.enabled) {
                    return;
                  }

                  return (
                    <div
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <ListItem
                        key={option.id}
                        onClick={() => {
                          if (itemAvailable) {
                            handleNewSelection(option);
                            selectOption(option.id);
                          }
                          //console.log(selectedAttribute);
                        }}
                        selected={option.selected}
                        className="optionItem"
                        available={itemAvailable}
                        title={unavailableTitle}
                      >
                        {option.imageUrl && (
                          <ListItemImage
                            className="optionImage"
                            src={option.imageUrl}
                          />
                        )}
                        <div className="optionText">{option.name}</div>
                      </ListItem>
                    </div>
                  );
                })}
            </List>
          </div>

          <a href="#currentSelectionContainer" className="popup-trigger">
            Show Selection{" "}
            <span className="material-symbols-outlined">list_alt</span>{" "}
          </a>

          <div
            id="currentSelectionContainer"
            className="currentSelectionContainer"
          >
            <h3 className="popup__title">My Vanity</h3>
            <h4 className="popup__productName">{productName}</h4>
            <a href="#" className="popup-close">
              &times;
            </a>
            <div className="selections-list">
              {currentSelection &&
                currentSelection.map((selection) => {
                  if (selection.show) {
                    return (
                      <div className="selection">
                        <span className="selection--attribute">
                          {selection.attributeName}
                        </span>
                        <span className="selection--option">
                          {selection.optionName}
                        </span>
                      </div>
                    );
                  }

                  return null;
                })}
            </div>
            <h3 className="productBanner--price popup-price">${price}</h3>
            {isAddToCartLoading ? (
              <button className="productBanner--button popup-button" disabled>
                Adding to cart...
              </button>
            ) : (
              <button
                className="productBanner--button popup-button"
                onClick={addToCart}
                disabled={disableCartBtn}
              >
                Add to cart
              </button>
            )}

            {/*
              <button onClick={()=>{
                getMobileArUrl().then(res => {
                  if(res){
                    setQrUrl(res);
                    console.log(res);
                  }
                });

              }}/>

            <QRCodeComponent url={qrUrl} />
            */}

            <span
              className="email-text"
              onClick={() => {
                //toggleEmailPop();
                setShowingEmail(!showingEmail);
                //savePDFUrl();
                const close = document.querySelector(
                  ".popup-close"
                ) as HTMLAnchorElement;
                if (close) {
                  close.click();
                }
              }}
            >
              <span>Download my design &nbsp;</span>
              <span className="material-symbols-outlined">download</span>
            </span>
          </div>
        </div>
      </div>

      <div className="productBanner">
        <h3 className="productBanner--title">{productName}</h3>
        <div className="productBanner--group">
          <h3 className="productBanner--price">${price}</h3>

          {isAddToCartLoading ? (
            <div>
              <div className="addToCart-Loader">
                <MoonLoader color="#000" />
                <span>Creating your custom vanity</span>
                <span>This may take a few moments</span>
              </div>
              <button className="productBanner--button" disabled>
                Adding to cart&nbsp;
                <span className="material-symbols-outlined">
                  {" "}
                  shopping_cart{" "}
                </span>
              </button>
            </div>
          ) : (
            <button
              className="productBanner--button"
              onClick={(event) => {
                event.preventDefault();
                addToCart({ "": "" });
                console.log("add to cart");
              }}
              disabled={disableCartBtn}
            >
              Add to cart&nbsp;
              <span className="material-symbols-outlined"> shopping_cart </span>
            </button>
          )}
        </div>
      </div>

      {showingEmail && (
        <div className="emailPopup__container">
          {loadingPDF ? (
            <div className="emailer__loading">
              {/* isChecked ? (<h4>Sending the emails</h4>) : (<h4>Not sending emails</h4>) */}
              <SquareLoader color="#002240" />
              <h5>This may take a moment while we build your PDF</h5>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="emailer-form">
              <button className="emailer-close" onClick={toggleEmailPop}>
                ×
              </button>
              <h3 className="emailer__title">
                Enter your email to download your custom vanity design
              </h3>

              <input
                type="email"
                id="emailInput"
                name="email"
                required
                placeholder="Your Email"
                className="emailInput"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />

              <label htmlFor="checkbox" className="emailer-check__label">
                <input
                  type="checkbox"
                  id="checkbox"
                  name="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    setIsChecked(!isChecked);
                  }}
                />
                &nbsp;Subscribe to Cass Brothers newsletter
              </label>
              <button type="submit" className="emailer__btn">
                Download my design{" "}
                <span className="material-symbols-outlined">download</span>
              </button>
            </form>
          )}
        </div>
      )}
    </Container>
  );
};

export default Selector;
