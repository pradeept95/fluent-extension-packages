import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const usePaginationStyle = makeStyles({
  paginationContainer: {
    width: "100%",
    backgroundColor: tokens.colorNeutralBackground2Hover,
    ...shorthands.padding("5px"),
  },
  
  wrapper: {
    columnGap: "0.2rem",
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-between", 
    
    // if smaller size display flex column
    "@media screen and (max-width: 640px)": {
      flexDirection: "column",
      rowGap: "0.2rem",
    },
  },
  pageBtnContainer: {
    display: "flex",
    columnGap: "3px",
  },
  pageBtn: {
    minWidth: "1.5rem",
    minHeight: "1.5rem",
    alignContent: "center",
    alignItems: "center",
  },
  pageSelectionWrapper: {
    minWidth: "1.5rem",
    display: "flex", 
    alignItems: "center",
    gap: "1rem",
  },
  pageSelectionDropdown: {
    minWidth: "100%",
  },
  pageSizeInput: {
    minWidth: "1.5rem",
    width: "3rem",
  },

  pageSizeText: {
    flex: 1,
    minWidth: "100%",
    fontSize: "0.8rem"
  },
});
