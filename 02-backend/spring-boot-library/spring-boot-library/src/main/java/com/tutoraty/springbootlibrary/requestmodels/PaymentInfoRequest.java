package com.tutoraty.springbootlibrary.requestmodels;

import lombok.Data;

@Data
public class PaymentInfoRequest {
	
	private int amount;
	
	private String currency;
	
	private String receiptEmail;

	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public String getReceiptEmail() {
		return receiptEmail;
	}

	public void setReceiptEmail(String receiptEmail) {
		this.receiptEmail = receiptEmail;
	}
	
	
	

}
