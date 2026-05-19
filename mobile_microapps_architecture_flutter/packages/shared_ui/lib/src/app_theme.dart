import 'package:flutter/material.dart';

abstract final class AppColors {
  static const ink = Color(0xFF17202A);
  static const mutedInk = Color(0xFF64748B);
  static const surface = Color(0xFFF8FAFC);
  static const panel = Color(0xFFFFFFFF);
  static const border = Color(0xFFE2E8F0);
  static const brand = Color(0xFF0F766E);
  static const accent = Color(0xFF2563EB);
  static const success = Color(0xFF15803D);
  static const warning = Color(0xFFB45309);
}

abstract final class AppTheme {
  static ThemeData light() {
    final colorScheme = ColorScheme.fromSeed(
      seedColor: AppColors.brand,
      brightness: Brightness.light,
      surface: AppColors.surface,
    );

    return ThemeData(
      colorScheme: colorScheme,
      useMaterial3: true,
      scaffoldBackgroundColor: AppColors.surface,
      appBarTheme: const AppBarTheme(
        centerTitle: false,
        elevation: 0,
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.ink,
      ),
      cardTheme: CardThemeData(
        color: AppColors.panel,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: const BorderSide(color: AppColors.border),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }
}
