/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import router from "../__mocks__/router.js";
import {ROUTES, ROUTES_PATH} from "../constants/routes.js";


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then new bill icon in vertical layout should be highlighted", () => {
      /* It's setting user type as Employee in localStorage */
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee"
        })
      )

      /* It's rendering BillsUI in order to test icon */
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)

      /* It's defining URL to NewBill */
      window.location.assign(ROUTES_PATH['NewBill'])
      router()

      /* It's testing if bills icon is active (highlighted) */
      const billsIcon = screen.getByTestId("icon-mail")
      expect(billsIcon.classList.contains("active-icon")).toBeTruthy()
    })
  })
})
