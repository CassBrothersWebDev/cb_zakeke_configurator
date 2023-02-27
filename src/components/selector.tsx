import React, { FunctionComponent } from "react";
import { useZakeke } from "zakeke-configurator-react";
import { useState } from "react";
import { useEffect } from "react";
import { List, ListItem, ListItemImage } from "./list";
import styled from "styled-components";
import { SquareLoader } from "react-spinners";

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
    loadComposition,
    addToCart,
    currentTemplate,
    templates,
    items,
    setTemplate,
    getMeshIDbyName,
    hideMeshAndSaveState,
    restoreMeshVisibility,
    setCamera,
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

      console.log({ second: astuccioGroup, selectedGroupId });
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
        
          <span className="loading__text">Loading your Vanity Builder</span><br/>
          <span>This may take a few moments</span>
        
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
  }

  let counter = 0;

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
              attributes.map((attribute) => {
                counter += 1;
                return (
                  <ListItem
                    key={attribute.id}
                    onClick={() => {
                      selectAttribute(attribute.id);
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
              className="selectHeader--prev"
              onClick={() => {
                if (selectedAttribute) {
                  const currentIndex = attributes.indexOf(selectedAttribute);

                  var nextIndex;
                  if (currentIndex === 0) {
                    nextIndex = attributes.length - 1;
                  } else {
                    nextIndex = currentIndex - 1;
                  }

                  selectAttribute(attributes[nextIndex].id);
                }
              }}
            >
              Prev
            </button>
            <h3 className="selectHeader--text">
              {selectedAttribute && selectedAttribute.name}
            </h3>
            <button
              className="selectHeader--next"
              onClick={() => {
                if (selectedAttribute) {
                  const currentIndex = attributes.indexOf(selectedAttribute);
                  const nextIndex = (currentIndex + 1) % attributes.length;
                  selectAttribute(attributes[nextIndex].id);
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

          <div className="currentSelectionContainer">
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
          <span className="email-text">Email my design</span>
        </div>
      </div>

      <div className="productBanner">
        <h3 className="productBanner--title">{product?.name}</h3>
        <h3 className="productBanner--price">${price}</h3>
        {isAddToCartLoading ? (
          <button className="productBanner--button" disabled={true}>
            Adding to cart...
          </button>
        ) : (
          <button className="productBanner--button" onClick={addToCart}>
            Add to cart
          </button>
        )}
      </div>
    </Container>
  );
};

export default Selector;
