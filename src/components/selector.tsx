import React, { FunctionComponent } from "react";
import { useZakeke } from "zakeke-configurator-react";
import { useState } from "react";
import { useEffect } from "react";
import { List, ListItem, ListItemImage } from "./list";
import styled from "styled-components";
import { SquareLoader } from "react-spinners";
import Circles from "./circles";
import axios from "axios";
import { addEmail } from "./addtoEmailList";

const Container = styled.div`
  height: 100%;
  overflow: auto;
`;

interface currentSelectionObj {
  attributeId: number;
  attributeName: string;
  optionName: string;
}

const Selector: FunctionComponent<{}> = () => {
  const {
    isSceneLoading,
    product,
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
    setCameraByName
  } = useZakeke();

  const [currentSelection, setCurrentSelection] = useState<
    currentSelectionObj[]
  >([]);

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

  // To set add to cart but disabled if all options are not chosen
  const [disableCartBtn, setDisableCartBtn] = useState(true);

  const [showingEmail, setShowingEmail] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [email, setEmail] = useState("");

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

  function handleNewSelection(selection: string) {
    let newObject: currentSelectionObj = {
      attributeId: 0,
      attributeName: "selectedAttribute",
      optionName: selection,
    };

    if (selectedAttribute) {
      newObject = {
        attributeId: selectedAttribute.id,
        attributeName: selectedAttribute.name,
        optionName: selection,
      };
    }

    const updatedArray = currentSelection.map((obj) => {
      if (obj.attributeId === newObject.attributeId) {
        return newObject;
      } else {
        return obj;
      }
    });

    if (
      !updatedArray.some((obj) => obj.attributeId === newObject.attributeId)
    ) {
      updatedArray.push(newObject);

      const addCheckElement = document.getElementById(
        newObject.attributeId.toString()
      );
      if (addCheckElement) {
        addCheckElement.classList.add("show-after");
      }
    }

    setCurrentSelection(updatedArray);

    var requiredLength = attributes.length;
    if (accesoriesExists) {
      requiredLength = attributes.length - 1;
    }

    if (updatedArray.length === requiredLength) {
      setDisableCartBtn(false);
    }
  }

  let counter = 0;

  const prevBtnObj = document.getElementById("prevBtn");
  const nextBtnObj = document.getElementById("nextBtn");

  let accesoriesExists = false;

  const downloadPdf = async () => {
    try {
      
      const pdfUrl = await getPDF(); // assuming getPdfUrl returns a promise that resolves with the URL of the PDF
      const response = await axios.get(pdfUrl, { responseType: "blob" });
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
    } catch (error) {
      console.error("Error while downloading PDF:", error);
    }
  };

  const toggleEmailPop = () => {
    const element = document.getElementsByClassName(
      "popup-close"
    )[0] as HTMLAnchorElement;
    element.click();

    setShowingEmail(!showingEmail);

    setIsChecked(true);
    // Start getURL
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadingPDF(true);
    downloadPdf();

    if (isChecked) {
      // Add the email to the klaviyo list
      addEmail(email);
    }
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
                  >
                    Step: {step.name}
                  </ListItem>
                );
              })}
            </List>
          )}

          <List>
            {attributes &&
              attributes.map((attribute, index) => {
                counter += 1;
                if (attribute.name === "Accessories") {
                  accesoriesExists = true;
                }
                return (
                  <ListItem
                    key={attribute.id}
                    onClick={() => {
                      selectAttribute(attribute.id);
                      if (index !== attributes.length - 1) {
                        nextBtnObj?.classList.remove("hidden");
                      } else {
                        nextBtnObj?.classList.add("hidden");
                      }
                      setCameraByName(attribute.name, false, true);
                    }}
                    selected={selectedAttribute === attribute}
                    className="attributeListItem"
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

                  selectAttribute(attributes[currentIndex].id);
                  setCurrentOption(currentIndex + 1);
                  setCameraByName(attributes[currentIndex].name, false, true);

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

                  selectAttribute(attributes[currentIndex].id);
                  setCurrentOption(currentIndex + 1);
                  setCameraByName(attributes[currentIndex].name, false, true);

                }
              }}
            >
              Next
            </button>
          </div>
          <div className="optionContainer">
            <List>
              {selectedAttribute &&
                selectedAttribute.options.map((option) => {
                  return (
                    <div
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <ListItem
                        key={option.id}
                        onClick={() => {
                          selectOption(option.id);
                          handleNewSelection(option.name);
                        }}
                        selected={option.selected}
                        className="optionItem"
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
            <h4 className="popup__productName">{product?.name}</h4>
            <a href="#" className="popup-close">
              &times;
            </a>
            <div className="selections-list">
              {currentSelection &&
                currentSelection.map((selection) => {
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

            <span className="email-text" onClick={toggleEmailPop}>
              <span>Download my design &nbsp;</span>
              <span className="material-symbols-outlined">download</span>
            </span>
          </div>
        </div>
      </div>

      <div className="productBanner">
        <h3 className="productBanner--title">{product?.name}</h3>
        <h3 className="productBanner--price">${price}</h3>
        {isAddToCartLoading ? (
          <button className="productBanner--button" disabled>
            Adding to cart...
          </button>
        ) : (
          <button
            className="productBanner--button"
            onClick={(event) => 
             { event.preventDefault();
              addToCart({"":""});
              console.log("add to cart");
            }
            }
            disabled={disableCartBtn}
          >
            Add to cart
          </button>
        )}
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
              <a href="#" className="emailer-close" onClick={toggleEmailPop}>
                ×
              </a>
              <h3 className="emailer__title">
                Share your email and we will send you our Ultimate Vanity Guide
                together with your design
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
