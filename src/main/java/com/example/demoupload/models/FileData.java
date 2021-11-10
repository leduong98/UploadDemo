package com.example.demoupload.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileData {
    private String filename;
    private String url;
    private Long size;
}
