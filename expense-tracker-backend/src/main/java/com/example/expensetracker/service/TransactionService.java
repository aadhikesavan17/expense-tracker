package com.example.expensetracker.service;

import com.example.expensetracker.dto.DashboardDTO;
import com.example.expensetracker.dto.TransactionDTO;
import com.example.expensetracker.entity.Transaction;
import com.example.expensetracker.entity.TransactionType;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.repository.TransactionRepository;
import com.example.expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    public TransactionDTO addTransaction(TransactionDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setAmount(dto.getAmount());
        transaction.setType(dto.getType());
        transaction.setCategory(dto.getCategory());
        transaction.setDate(dto.getDate());
        transaction.setNotes(dto.getNotes());

        Transaction saved = transactionRepository.save(transaction);
        dto.setId(saved.getId());
        return dto;
    }

    public TransactionDTO editTransaction(Long id, TransactionDTO dto) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        transaction.setAmount(dto.getAmount());
        transaction.setType(dto.getType());
        transaction.setCategory(dto.getCategory());
        transaction.setDate(dto.getDate());
        transaction.setNotes(dto.getNotes());

        Transaction saved = transactionRepository.save(transaction);
        return dto; // Using original dto since we only update fields
    }

    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }

    public List<TransactionDTO> getTransactions(Long userId, Integer month, Integer year) {
        List<Transaction> transactions;
        if (month != null && year != null) {
            transactions = transactionRepository.findByUserIdAndMonthAndYear(userId, month, year);
        } else {
            transactions = transactionRepository.findByUserIdOrderByDateDesc(userId);
        }
        
        return transactions.stream().map(t -> {
            TransactionDTO dto = new TransactionDTO();
            dto.setId(t.getId());
            dto.setUserId(t.getUser().getId());
            dto.setAmount(t.getAmount());
            dto.setType(t.getType());
            dto.setCategory(t.getCategory());
            dto.setDate(t.getDate());
            dto.setNotes(t.getNotes());
            return dto;
        }).collect(Collectors.toList());
    }

    public DashboardDTO getDashboardSummary(Long userId) {
        List<Transaction> transactions = transactionRepository.findByUserIdOrderByDateDesc(userId);
        
        BigDecimal income = transactions.stream()
                .filter(t -> t.getType() == TransactionType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal expense = transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        return new DashboardDTO(income, expense, income.subtract(expense));
    }
}
