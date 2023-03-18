package com.tutoraty.springbootlibrary.responsemodels;

import com.tutoraty.springbootlibrary.entity.Book;

import lombok.Data;

@Data
public class ShelfCurrentLoansResponse {
	
	private Book book;
	
	private int daysLeft;
	
	public ShelfCurrentLoansResponse() {
		
	}
	
	public ShelfCurrentLoansResponse(Book book, int daysLeft ) {
		this.book=book;
		this.daysLeft=daysLeft;
	}

	public Book getBook() {
		return book;
	}

	public void setBook(Book book) {
		this.book = book;
	}

	public int getDaysLeft() {
		return daysLeft;
	}

	public void setDaysLeft(int daysLeft) {
		this.daysLeft = daysLeft;
	}
	
	
}
