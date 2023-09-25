const { chromium } = require("playwright");
const { test, expect } = require("@playwright/test");

test("Open the web page", async () => {
  try {
    const browser = await chromium.launch({
      headless: false,
      channel: "chrome",
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    //메인페이지
    await page.goto("https://illuminarean.com/");

    //모달 창닫기
    const element = await page.$('[aria-label="company:close_modal"]');
    expect(element).not.toBeNull();
    await element.click();

    //work 클릭
    const workElement = await page.$('[aria-label="a11y:Work"]');
    expect(workElement).not.toBeNull();
    await workElement.click();

    //GOODVIBE WORKS 클릭
    const buttonElement = await page.getByText("GOODVIBE WORKS 바로가기");
    if (buttonElement) {
      await buttonElement.evaluate((element) => {
        element.removeAttribute("target");
        console.log("지워짐");
      });
    }
    await buttonElement.click();

    //무료체험신청 클릭
    const buttonByText = page.locator("button:has-text('무료 체험 신청')");

    if (buttonByText) {
      await buttonByText.nth(0).click();
      console.log("무료 체험 버튼 클릭함");
    } else {
      console.error("버튼 찾을수 없음");
    }

    //input값 입력
    await page.fill("#companyName", "김다빈");
    await page.fill("#ceoName", "김다빈");

    //사업자유형, 직원수
    await page.evaluate(() => {
      const divElements = document.querySelectorAll(
        ".react-select__single-value.css-1uccc91-singleValue"
      );

      if (divElements.length >= 2) {
        divElements[0].textContent = "개인";
        divElements[1].textContent = "21-50 명";
      }
    });

    //담당자명, 이메일, 휴대폰번호
    await page.fill("#name", "김다빈");
    await page.fill("#email", "kdabina@naver.com");
    await page.fill("#mobile", "010-0000-0000");

    //담당 업무
    const selectElement = page.locator(".css-1fr3mkc.el0tj9910");
    if (selectElement) {
      await selectElement.click();
      console.log("담당업무 셀렉트 선택됨");

      //회계 클릭으로 선택
      const element1 = page.locator("button:has-text('회계')");
      await element1.click();

      //인사 검색으로 선택
      const parentDivSelector = ".css-eo4pu5.el0tj993";
      const parentDivElement = await page.$(parentDivSelector);

      if (parentDivElement) {
        // 부모 div 안에 있는 input 요소를 찾음
        const inputElement = await parentDivElement.$('input[type="text"]');
        console.log("부모요소 찾음");
        if (inputElement) {
          await inputElement.fill("인사");
          const hrBtn = page.locator("button:has-text('인사')");
          await hrBtn.click();
          await page.waitForTimeout(3000);

          const registerBtn = page.locator("button:has-text('등록')");
          await registerBtn.click();
          await page.waitForTimeout(3000);
        } else {
          console.error("Input 요소를 찾을 수 없습니다.");
        }
      } else {
        console.error("부모 div 요소를 찾을 수 없습니다.");
      }
    } else {
      console.log("담당업무 셀렉트 선택 안됨");
    }

    await browser.close();
  } catch (error) {
    console.error(error);
  }
});
